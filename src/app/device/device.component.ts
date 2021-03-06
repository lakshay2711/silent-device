import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { AppService } from '../app.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'mps-single-devices',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit, OnDestroy {

  devices: any;
  deviceSubscription: Subscription;

  fileName = 'SilentDevicesSheet.xlsx';
  fileToUpload: File = null;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getDevicesDetails()
      .subscribe((result) => {
        this.devices = result;
        console.log('json :: ', this.devices);
      },
        (err) => {
          console.log("err", err);
        }
      )


  }



  exportexcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.devices);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "SilentDevices");
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    let tempArray = [];

    var files = ev.target.files, file;
    if (!files || files.length == 0) return;
    file = files[0];
    var fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      var filename = file.name;
      // call 'xlsx' to read the file
      var binary = "";
      var bytes = new Uint8Array(e.target.result as any);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      workBook = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        tempArray = XLSX.utils.sheet_to_json(sheet, { dateNF: "dd.MM.yyyy" });
        this.devices = tempArray.map(el => {
          if (el.hasOwnProperty("Product Number")) {
            el.pNo = el["Product Number"];
            delete el["Product Number"];
          }
          if (el.hasOwnProperty("Partner")) {
            el.partner = el["Partner"];
            delete el["Partner"];
          }
          if (el.hasOwnProperty("MS Contract ID")) {
            el.contractId = el["MS Contract ID"];
            delete el["MS Contract ID"];
          }
          if (el.hasOwnProperty("Last Modified Date")) {
            el.lastmodifieddate = el["Last Modified Date"];
            delete el["Last Modified Date"];
            var date = new Date(el.lastmodifieddate),
              mnth = ("0" + (date.getMonth() + 1)).slice(-2),
              day = ("0" + (date.getDate() + 1)).slice(-2);
            el.lastmodifieddate = [mnth, day, date.getFullYear()].join("/");
          }
          return el;
        });
        return initial;
      }, {});
      console.log(jsonData.Sheet1);
    };
    fileReader.readAsArrayBuffer(file);
    
    // let workBook = null;
    // let jsonData = null;
    // let tempArray = [];
    // const reader = new FileReader();
    // const file = ev.target.files[0];
    // reader.onload = (event) => {
    //   const data = reader.result;
    //   workBook = XLSX.read(data, {
    //     type: 'binary',
    //     cellDates: true
    //   });
    //   jsonData = workBook.SheetNames.reduce((initial, name) => {
    //     const sheet = workBook.Sheets[name];
    //     initial[name] = XLSX.utils.sheet_to_json(sheet);
    //     tempArray = XLSX.utils.sheet_to_json(sheet, { dateNF: "dd.MM.yyyy" });
    //     this.devices = tempArray.map(el => {
    //       if (el.hasOwnProperty("Product Number")) {
    //         el.pNo = el["Product Number"];
    //         delete el["Product Number"];
    //       }
    //       if (el.hasOwnProperty("Partner")) {
    //         el.partner = el["Partner"];
    //         delete el["Partner"];
    //       }
    //       if (el.hasOwnProperty("MS Contract ID")) {
    //         el.contractId = el["MS Contract ID"];
    //         delete el["MS Contract ID"];
    //       }
    //       if (el.hasOwnProperty("Last Modified Date")) {
    //         el.lastmodifieddate = el["Last Modified Date"];
    //         delete el["Last Modified Date"];
    //         var date = new Date(el.lastmodifieddate),
    //           mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    //           day = ("0" + (date.getDate() + 1)).slice(-2);
    //         el.lastmodifieddate = [mnth, day, date.getFullYear()].join("/");
    //       }
    //       return el;
    //     });
    //     console.log(this.devices);
    //     return initial;
    //   }, {});
    //   console.log(jsonData.Sheet1);
    // }
    // reader.readAsBinaryString(file);
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }

}


