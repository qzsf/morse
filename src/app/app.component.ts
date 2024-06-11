import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent, zipAll } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'morse';
  // key events
  subKeydown!: Subscription;
  subKeyup!: Subscription;
  // timestamps to track events
  keydown!: Number;
  keyup!: Number;

  // array to hold the morse codes
  code: string[] = [];
  // array to hold corresponding letters to the morse code
  letter: string[] = [];
  codeString: string = '';

  letterChart: any = {
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----'
  }

  // timers
  translateLetter: any;
  insertSpace: any;


  reset(event: Event) {
    this.code = [];
    this.letter = [];
    this.keyup = Number(null);
    (event.target as HTMLButtonElement).blur();
  }

  translate(lString: string) {
    const letter = Object.keys(this.letterChart).find(key => this.letterChart[key] === lString);
    if (letter) {
      this.letter.push(letter);
    } else {
      this.letter.push('ERR');
    }
  }

  ngOnInit() {
    this.subKeydown = fromEvent(document, 'keydown').subscribe(
      event => {
        // if a key is not being held down
        // when a key is being held down, it keeps triggering the 'keydown' event
        if (!(event as KeyboardEvent).repeat) {
          this.keydown = Date.now();
          clearTimeout(this.translateLetter);
          clearTimeout(this.insertSpace);
        }
      }
    );

    this.subKeyup = fromEvent(document, 'keyup').subscribe(
      event => {
        this.keyup = Date.now();
        // longer than 250 ms press is a "-". less than or equal to 250 ms is a "."
        if ((this.keyup.valueOf() - this.keydown.valueOf()) > 250) {
          this.code.push('-');
          this.codeString += '-';
        } else {
          this.code.push('.');
          this.codeString += '.';
        }
        console.log(this.code)

        // not active for 1 second, 
        // then translate the current string into a letter and insert it to the letter array.
        this.translateLetter = setTimeout(() => {
          this.code.push('|');
          this.translate(this.codeString);
          this.codeString = '';
          console.log(this.letter)
        }, 1000);

        // not active for 2 second, 
        // then it's the end of a word and insert a ' ' to the letter array.
        this.insertSpace = setTimeout(() => {
          this.code.push('||');
          this.letter.push(' ');
          console.log(this.letter)
        }, 2000);

      }
    )
  }

  ngOnDestroy() {
    this.subKeydown.unsubscribe();
    this.subKeyup.unsubscribe();
  }
}
