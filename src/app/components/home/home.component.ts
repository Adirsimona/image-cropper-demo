import { ImageService } from './../../../share/services/image.service';
import { Component, OnInit } from '@angular/core';
import { CropperShape } from 'src/share/enums';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private selectedFile: any;
  private cropperFile: File;
  private currShape     =  CropperShape.square;
  private imageSrc      = '';
  private isFileChoose  = false ;
  private shapes        = [
    {label: 'Circle' , value: CropperShape.circle},
    {label: 'Square' , value: CropperShape.square},
    {label: 'Rectangle' , value: CropperShape.rectangle},
  ];

  /**
   * Creates an instance of home component.
   * @param imageService
   * @param ngxService
   */
  constructor(private imageService: ImageService,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
  }

  /**
   * Determines whether shape change on
   * @param e
   */
  onShapeChange(e): void {
    console.log(e);
  }

  /**
   * Determines whether file changed on
   * @param event
   */
  onFileChanged(event): void {
    console.log(event);
    const file        = event.target.files[0];
    this.isFileChoose = file ? true : false ;
    if (this.isFileChoose) {
        this.processFile(event.target);
    }
  }

  /**
   * Process file
   * @param imageInput
   */
  processFile(imageInput: HTMLInputElement): void {
    const file: File = imageInput.files[0];
    const reader     = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = file;
      this.imageSrc     = event.target.result;
    });

    reader.readAsDataURL(file);
  }

  /**
   * Uploads image to the server
   */
  upload(): void {
    this.ngxService.start();
    this.imageService.uploadImage(this.cropperFile)
      .subscribe(res => {
        this.ngxService.stop();
        setTimeout(() => {
          swal.fire({
            title: 'Image has been save!',
            html: 'You can see your cropped imaged under uploads folder in the node server.',
            type: 'success'
          });
        }, 1001);
        console.log(res);
      }, err => {
        this.ngxService.stop();
        console.log(err);
      });
  }

  /**
   * Determines whether cropper change on
   * @param e
   */
  onCropperChange(e): void {
    this.cropperFile = e;
  }

}
