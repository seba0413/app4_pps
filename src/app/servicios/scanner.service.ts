import { Injectable } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

const opciones: BarcodeScannerOptions = {
  preferFrontCamera: false, // iOS and Android
  showFlipCameraButton: true, // iOS and Android
  // showTorchButton: true, // iOS and Android
  // torchOn: true, // Android, launch with the torch switched on (if available)
  // saveHistory: true, // Android, save scan history (default false)
  prompt: 'Scanee el código QR', // Android
  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
  // formats: 'PDF_417', // default: all but PDF_417 and RSS_EXPANDED
  // orientation: 'landscape', // Android only (portrait|landscape), default unset so it rotates with the device
  disableAnimations: true, // iOS
  disableSuccessBeep: false // iOS and Android
};

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(public barcodeScanner: BarcodeScanner) { }

  scan() {
    return this.barcodeScanner.scan(opciones);
  }
}
