"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Scan, X, Camera, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type BarcodeScannerProps = {
  isOpen: boolean
  onClose: () => void
  onScanSuccess: (barcode: string, productData?: any) => void
}

export function BarcodeScanner({ isOpen, onClose, onScanSuccess }: BarcodeScannerProps) {
  const [scanMode, setScanMode] = useState<'barcode' | 'photo'>('barcode')
  const [isScanning, setIsScanning] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only initialize when dialog is open and DOM is ready
    if (isOpen) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        if (scanMode === 'barcode') {
          initScanner()
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        stopScanner()
        stopPhotoMode()
      }
    }

    return () => {
      stopScanner()
      stopPhotoMode()
    }
  }, [isOpen, scanMode])

  const initScanner = async () => {
    try {
      // Check if element exists before initializing
      const element = document.getElementById("barcode-reader")
      if (!element) {
        console.warn("Barcode reader element not found yet")
        return
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("barcode-reader")
        isInitialized.current = true
      }
    } catch (err) {
      console.error("Error initializing scanner:", err)
      setError("Failed to initialize camera")
    }
  }

  const startScanner = async () => {
    if (!scannerRef.current) return

    setIsScanning(true)
    setError(null)

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Successfully scanned
          await handleScan(decodedText)
        },
        (errorMessage) => {
          // Scanning error (can be ignored, happens frequently)
        }
      )
    } catch (err: any) {
      console.error("Error starting scanner:", err)
      setError(err.message || "Failed to start camera")
      setIsScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        setIsScanning(false)
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
  }

  // Photo mode functions
  const startPhotoMode = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setIsScanning(true)
    } catch (err: any) {
      console.error("Error starting camera:", err)
      setError(err.message || "Failed to access camera")
    }
  }

  const stopPhotoMode = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    setCapturedImage(imageData)
    stopPhotoMode()

    // Process the image
    analyzeProductImage(imageData)
  }

  const analyzeProductImage = async (imageData: string) => {
    setIsFetching(true)
    setError(null)

    try {
      // Convert base64 to blob
      const base64Data = imageData.split(',')[1]

      // Use Google Cloud Vision API for text detection
      const visionApiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY

      if (!visionApiKey) {
        // Fallback: Try to extract text using Tesseract.js or simple pattern matching
        // For now, we'll search Open Food Facts with a generic query
        setError("Image recognition not configured. Please use barcode scanner or manual entry.")
        setIsFetching(false)
        return
      }

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Data },
              features: [
                { type: 'TEXT_DETECTION', maxResults: 10 },
                { type: 'LOGO_DETECTION', maxResults: 5 }
              ]
            }]
          })
        }
      )

      const data = await response.json()

      if (data.responses && data.responses[0]) {
        const textAnnotations = data.responses[0].textAnnotations
        const logoAnnotations = data.responses[0].logoAnnotations

        let productName = ''
        let brandName = ''

        // Extract brand from logo detection
        if (logoAnnotations && logoAnnotations.length > 0) {
          brandName = logoAnnotations[0].description
        }

        // Extract text and try to identify product name
        if (textAnnotations && textAnnotations.length > 0) {
          const fullText = textAnnotations[0].description

          // Try to find product name from text
          const lines = fullText.split('\n').filter(line => line.trim().length > 0)

          // Look for common skincare keywords
          const keywords = ['serum', 'cream', 'cleanser', 'moisturizer', 'toner', 'oil', 'gel', 'lotion', 'essence', 'mask']
          const productLine = lines.find(line =>
            keywords.some(keyword => line.toLowerCase().includes(keyword))
          )

          if (productLine) {
            productName = productLine
          } else if (lines.length > 0) {
            productName = lines[0] // Use first line as fallback
          }
        }

        // Search for the product in Open Food Facts
        if (productName || brandName) {
          const searchQuery = `${brandName} ${productName}`.trim()
          const searchResponse = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&tagtype_0=categories&tag_contains_0=contains&tag_0=beauty&page_size=5`
          )
          const searchData = await searchResponse.json()

          if (searchData.products && searchData.products.length > 0) {
            const product = searchData.products[0]
            const productData = {
              name: product.product_name || productName || "Unknown Product",
              brand: product.brands?.split(',')[0]?.trim() || brandName || "",
              image: product.image_url || null,
            }

            onScanSuccess("", productData)
            onClose()
          } else {
            // No match found, return extracted data
            if (productName || brandName) {
              onScanSuccess("", {
                name: productName || "Unknown Product",
                brand: brandName || "",
                image: null
              })
              onClose()
            } else {
              setError("Could not identify product. Please try again or enter manually.")
            }
          }
        } else {
          setError("Could not extract product information from image. Please try again.")
        }
      } else {
        setError("Could not analyze image. Please try again or use barcode scanner.")
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      setError("Failed to analyze image. Please try again.")
    } finally {
      setIsFetching(false)
      setCapturedImage(null)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setError(null)
    startPhotoMode()
  }

  const handleScan = async (barcode: string) => {
    setIsFetching(true)
    await stopScanner()

    try {
      // Fetch product data from Open Food Facts API
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
      )
      const data = await response.json()

      if (data.status === 1 && data.product) {
        // Product found
        const product = data.product
        const productData = {
          name: product.product_name || "Unknown Product",
          brand: product.brands?.split(',')[0]?.trim() || "",
          barcode: barcode,
          image: product.image_url || null,
        }

        onScanSuccess(barcode, productData)
        onClose()
      } else {
        // Product not found, still pass barcode
        onScanSuccess(barcode, null)
        onClose()
      }
    } catch (error) {
      console.error("Error fetching product data:", error)
      setError("Failed to fetch product information")
    } finally {
      setIsFetching(false)
    }
  }

  const handleClose = async () => {
    await stopScanner()
    stopPhotoMode()
    setCapturedImage(null)
    setError(null)
    setScanMode('barcode')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scanMode === 'barcode' ? <Scan className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            {scanMode === 'barcode' ? 'Scan Product Barcode' : 'Photo Recognition'}
          </DialogTitle>
          <DialogDescription>
            {scanMode === 'barcode'
              ? 'Point your camera at the product barcode'
              : 'Take a photo of the product packaging'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => {
                stopScanner()
                stopPhotoMode()
                setScanMode('barcode')
                setError(null)
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                scanMode === 'barcode'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Scan className="h-4 w-4 inline mr-2" />
              Barcode
            </button>
            <button
              onClick={() => {
                stopScanner()
                stopPhotoMode()
                setScanMode('photo')
                setError(null)
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                scanMode === 'photo'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Camera className="h-4 w-4 inline mr-2" />
              Photo
            </button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Scanner/Camera viewport */}
          <div className="relative">
            {scanMode === 'barcode' ? (
              <div
                id="barcode-reader"
                className="w-full rounded-lg overflow-hidden border-2 border-border"
                style={{ minHeight: "300px" }}
              />
            ) : (
              <div className="relative w-full rounded-lg overflow-hidden border-2 border-border bg-black" style={{ minHeight: "300px" }}>
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured product" className="w-full h-auto" />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto"
                    style={{ minHeight: "300px" }}
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {isFetching && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {scanMode === 'barcode' ? 'Fetching product info...' : 'Analyzing product...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {scanMode === 'barcode' ? (
              <>
                {!isScanning ? (
                  <Button onClick={startScanner} className="flex-1" disabled={isFetching}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={stopScanner} variant="secondary" className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Stop Scanning
                  </Button>
                )}
              </>
            ) : (
              <>
                {capturedImage ? (
                  <Button onClick={retakePhoto} variant="secondary" className="flex-1" disabled={isFetching}>
                    <Camera className="mr-2 h-4 w-4" />
                    Retake Photo
                  </Button>
                ) : !isScanning ? (
                  <Button onClick={startPhotoMode} className="flex-1" disabled={isFetching}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={capturePhoto} className="flex-1" disabled={isFetching}>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                )}
              </>
            )}
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {scanMode === 'barcode'
              ? 'Make sure the barcode is well-lit and clearly visible'
              : 'Position the product label in the center and make sure it\'s in focus'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
