import { Component } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Http } from '@capacitor-community/http';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor, CapacitorHttp, HttpOptions } from '@capacitor/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() {}

  // async pickAndUploadFile() {
  //   try {
  //     // Pick a file
  //     const result = await FilePicker.pickFiles({
  //       types: ['application/pdf'],
  //       readData: true
  //     });

  //     const fw = Filesystem.writeFile({
  //       path: result.files[0].name!,
  //       data: result.files[0].data!,
  //       directory: Directory.Documents,
  //       encoding: Encoding.UTF8,
  //     });

  //     let uri = (await fw).uri;

  //     if (result.files.length > 0) {

  //       // Read the file as Blob
  //       const response = await fetch(result.files[0].path!);
  //       const blob = await response.blob();

  //       // Create FormData and append the file
  //       const formData = new FormData();
  //       formData.append('file', blob, result.files[0].name);

  //       // Upload the file to the server
  //       const uploadResponse = await Http.post({
  //         url: 'http://172.16.254.10/upload.php',
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         data: formData,
  //       });

  //       console.log('Upload successful:', uploadResponse);
  //     } else {
  //       console.log('No file selected');
  //     }
  //   } catch (error) {
  //     console.error('Error picking or uploading file:', error);
  //   }
  // }

  async pickAndUploadFile() {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/pdf'],
        readData: true
      });

      if (result.files.length > 0) {
        const file = result.files[0];

        // Convert content URI to base64
        const fileData = await this.readFileAsBase64(file.name);

        // Convert base64 to Blob
        const blob = this.base64ToBlob(fileData.data, file.mimeType);

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', blob, file.name);

        // Upload the file to the server
        // const uploadResponse = await Http.post({
        //   url: 'http://172.16.254.10/upload.php',
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   data: formData,
        // });
        const options: HttpOptions = {
          url: 'http://172.16.254.10/upload.php',
          headers: {
            // Authorization: 'Basic writeKey:password',
            'Content-Type': 'multipart/form-data; charset=utf-8; boundary=' + Math.random().toString().substring(2),
            // 'Content-Type': 'multipart/form-data; charset=utf-8; boundary=' + Math.random().toString().substring(2),
            // 'enctype': 'multipart/form-data',
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'multipart/form-data',
          },
          data: formData
        };

        return from(CapacitorHttp.post(options));



        // console.log('Upload successful:', uploadResponse);
      } else {
        console.log('No file selected');
        return false;
      }
    } catch (error) {
      console.error('Error picking or uploading file:', error);
      return false;
    }
    return false;
  }

  async readFileAsBase64(path: string): Promise<{ data: any}> {
    try {
      const result = await Filesystem.readFile({
        path: path,
        directory: Directory.Documents,
      });

      return result

    } catch (error) {
      console.error('Error reading file as base64:', error);
      throw error;
    }
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

}
