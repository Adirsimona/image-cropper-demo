import {
  CropperShape
} from './../../../share/enums';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import Cropper from 'cropperjs';


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {

  @ViewChild('image', { static: false }) imageElement: ElementRef;
  @Input('selectedFile') selectedFile: File;
  // tslint:disable-next-line:variable-name
  _src: string;
  get src() {
    return this._src;
  }

  // tslint:disable-next-line:adjacent-overload-signatures
  @Input('src')
  set src(value) {
    this._src = value;
    setTimeout(() => {
      this.cropper = this.generateCropper();
    });
  }

  // tslint:disable-next-line:variable-name
  _shape: CropperShape;
  get shape(): CropperShape {
    return this._shape;
  }
  @Input('shape')
  set shape(value: CropperShape) {
    this._shape = value;
    if (this.imageElement) {
      this.cropper = this.generateCropper();
    }
  }

  @Output() cropperChange = new EventEmitter < File >();

  private imageDestination: string;
  private cropper: Cropper;
  private croppedFile: File;
  private baseOptions: { zoomable: boolean , scalable: boolean, viewMode: number } = {
    zoomable: true ,
    scalable: true ,
    viewMode: 0,
  };

  /**
   * Creates an instance of image cropper component.
   */
  constructor() {
    this.imageDestination = '';
  }

  /**
   * on init
   */
  ngOnInit() {}

  /**
   * after view init
   */
  ngAfterViewInit(): void {
    this.cropper = this.generateCropper();
  }

  /**
   * Updates cropper file
   * @param canvas
   */
  updateCropperFile(canvas: HTMLCanvasElement): void {
    canvas.toBlob((blob) => {
      const file = this.blobToFile(blob, this.selectedFile.name);
      this.cropperChange.emit(file);
    });
  }

  /**
   * Generates cropper
   * @returns Cropper
   */
  generateCropper(): Cropper {
    // tslint:disable-next-line:curly
    if (!this.imageElement) return;
    if (this.cropper) {
      this.cropper.destroy();
    }
    const generator  = (options): Cropper => new Cropper(this.imageElement.nativeElement, options);
    const create     = (options): Cropper => generator(Object.assign({}, this.baseOptions, options));
    const getCropper = (ratio: number = 0, handlerParam: boolean = false): Cropper => {
      return create({
        aspectRatio: ratio,
        crop: () => {
          this.cropHandler(handlerParam);
        }
      });
    };

    switch (+this.shape) {
      case +CropperShape.circle:
        return getCropper(1, true);
        break;
      case +CropperShape.rectangle:
        return getCropper();
        break;
      case +CropperShape.square:
        return getCropper(1);
        break;
      default:
        return getCropper(1);
        break;
    }
  }

  /**
   * Crops handler
   * @param isCircle
   */
  cropHandler(isCircle: boolean = false): void {
    if (isCircle) {
      const canvas          = this.cropper.getCroppedCanvas();
      const roundedCanvas   = this.getRoundedCanvas(canvas);
      this.imageDestination = roundedCanvas.toDataURL();
      this.updateCropperFile(roundedCanvas);
    } else {
      const canvas          = this.cropper.getCroppedCanvas();
      this.imageDestination = canvas.toDataURL('image/png');
      this.updateCropperFile(canvas);
    }
  }


  /**
   * Gets rounded canvas
   * @param sourceCanvas
   * @returns HTMLCanvasElement
   */
  getRoundedCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const canvas                     = document.createElement('canvas');
    const context                    = canvas.getContext('2d');
    const width                      = sourceCanvas.width;
    const height                     = sourceCanvas.height;
    canvas.width                     = width;
    canvas.height                    = height;
    context.imageSmoothingEnabled    = true;
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
  }

  /**
   * Blobs to file
   * @param theBlob
   * @param fileName
   * @returns File
   */
  blobToFile(theBlob: Blob, fileName: string): File {
    return new File([theBlob], fileName);
  }
}
