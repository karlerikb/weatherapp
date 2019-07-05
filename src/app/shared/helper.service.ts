import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  upperCaseFirstLetter(text: string) {
    const firstChar = text.charAt(0).toUpperCase();
    const remainingText = text.slice(1);
    return firstChar + remainingText;
  }
}
