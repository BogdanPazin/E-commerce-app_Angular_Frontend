import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    // METODA ZA CUSTOM VALIDACIJU
    static notOnlyWhitespace(control: FormControl): ValidationErrors{
        
        // AKO POLJE IMA SAMO RAZMAKE ONDA SE SALJE Validation Error Key 'notOnlyWhitespace'
        if((control.value != null) && (control.value.trim().length == 0)){
            return {'notOnlyWhitespace': true};
        }
        // AKO NE SADRZI SAMO RAZMAKE ONDA SALJI NULL
        else{
            return null!;
        }
    }
}
