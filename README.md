# jQuery pwdcheck

jQuery plugin for password strength verification.

## Usage

```javascript
$(function(){
    $('#input-password').pwdcheck();

    // default options
    $('#input-password').pwdcheck({
        validate: function(p){
            console.log(p) // percentage
        },
        defaultRules: [
            'hasNumbers',
            'hasLowerCaseLetters',
            'hasUppperCaseLetters',
            'hasSymbols',
            'threeOrMoreChars',
            'sixOrMoreChars',
            'eightOrMoreChars'
        ],
        renderWidget: true
    });
});
```
