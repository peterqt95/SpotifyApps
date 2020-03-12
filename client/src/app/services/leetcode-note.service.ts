import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { LeetcodeNote } from '@app/models/LeetcodeNote';
import { map } from 'rxjs/operators';

const flaskUrl = environment.flaskApi;

@Injectable({
  providedIn: 'root'
})
export class LeetcodeNoteService {

  flaskUrl = flaskUrl;

  constructor(
    private http: HttpClient
  ) { }

  public get(parameters: any) {
    const httpParams = this.buildParams(parameters);

    return this.http.get<LeetcodeNote[]>(this.flaskUrl + '/leetcode_notes', {params: httpParams}).pipe(
      map((results: LeetcodeNote[]) => {
        const returnResults = [];
        if (results) {
          results.forEach(result => {
            returnResults.push(new LeetcodeNote(result));
          });
        }
        return returnResults;
      })
    );
  }

  public getNote(noteId: number, parameters: any) {
    const httpParams = this.buildParams(parameters);

    return this.http.get<LeetcodeNote>(this.flaskUrl + '/leetcode_notes/' + noteId, {params: httpParams}).pipe(
      map((result: LeetcodeNote) => {
        let returnResult = null;
        if (result) {
          returnResult = new LeetcodeNote(result);
        }
        return returnResult;
      })
    );
  }

  private buildParams(parameters: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(parameters).forEach(parameter => {
      const value = parameters[parameter];
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(parameter, item);
        });
      } else {
        httpParams = httpParams.append(parameter, value);
      }
    });

    return httpParams;
  }
}
