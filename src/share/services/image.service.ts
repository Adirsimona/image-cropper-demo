import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ImageService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient ) {}

  uploadImage(image: File): Observable< any > {
    console.log('uploadImage');

    const formData = new FormData();
    formData.append('photo', image);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

//   makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
//     return new Promise((resolve, reject) => {
//         var formData: any = new FormData();
//         var xhr = new XMLHttpRequest();
//         for(var i = 0; i < files.length; i++) {
//             formData.append("uploads[]", files[i], files[i].name);
//         }
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState == 4) {
//                 if (xhr.status == 200) {
//                     resolve(JSON.parse(xhr.response));
//                 } else {
//                     reject(xhr.response);
//                 }
//             }
//         }
//         xhr.open("POST", url, true);
//         xhr.send(formData);
//     });
// }
}
