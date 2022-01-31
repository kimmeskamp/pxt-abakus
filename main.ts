/**
 * Schnelle Anzeige von mehrstelligen Zahlen für den Calliope mini
 * Thorsten Kimmeskamp, 31.01.2022
 */

//% weight=100 color=#0fbc11 icon="\uf1de" block="Abakus"
namespace abakus {

	export enum anzeigen {
        //% block="Tropfstein"
        tropfstein = 0,
        //% block="Soroban"
        soroban = 1
    }

	let anzeige = anzeigen.tropfstein

	/**
     * Wähle Anzeige
     */
    //% blockId="waehleAnzeige" block="wähle Anzeige: %wert"
    export function waehleAnzeige(wert: anzeigen) {
		anzeige = wert
	}
	
	function zeigeZifferTropfstein(wert: number, spalte: number) {
	    // Ziffer (0..9) in der angegebenen Bildschirm-Spalte (0..4) zeigen:
	
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	    // | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ungueltig |
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	    // | . | . | . | . | . | # | # | # | # | # |     .     |
	    // | . | . | . | . | # | # | . | # | # | # |     #     |
	    // | . | . | . | # | # | # | . | . | # | # |     .     |
	    // | . | . | # | # | # | # | . | . | . | # |     #     |
	    // | . | # | # | # | # | # | . | . | . | . |     .     |
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	
	    if (spalte >= 0 && spalte <= 4) { // auf gueltige Spalte kontrollieren
		    if (wert >= 0 && wert <= 5) { // fuer 0..5: "Tropfstein" von unten wachsen lassen
			    for (let Index = 0; Index <= wert - 1; Index++) {
				    led.plot(spalte, 4 - Index) // benoetigte Steine setzen
			    }
			    for (let Index = 0; Index <= 4 - wert; Index++) {
				    led.unplot(spalte, Index) // uebrige Steine loeschen
			    }
		    } else if (wert >= 6 && wert <= 9) { // fuer 6..9: "Tropfstein" von oben wachsen lassen
			    for (let Index = 0; Index <= wert - 6; Index++) {
				    led.plot(spalte, Index) // benoetigte Steine setzen
			    }
			    for (let Index = 0; Index <= 9 - wert; Index++) {
				    led.unplot(spalte, 4 - Index) // uebrige Steine loeschen
			    }
		    } else {
			    // keine gueltige Ziffer
			    led.unplot(spalte, 0)
			    led.plot(spalte, 1)
			    led.unplot(spalte, 2)
			    led.plot(spalte, 3)
			    led.unplot(spalte, 4)
		    }
        }
    }
	
    function zeigeZifferSoroban(wert: number, spalte: number) {
	    // Ziffer (0..9) in der angegebenen Bildschirm-Spalte (0..4) zeigen:
	
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	    // | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ungueltig |
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	    // | . | . | . | . | . | # | # | # | # | # |     .     |
	    // | . | # | # | # | # | . | # | # | # | # |     #     |
	    // | . | . | # | # | # | . | . | # | # | # |     .     |
	    // | . | . | . | # | # | . | . | . | # | # |     #     |
	    // | . | . | . | . | # | . | . | . | . | # |     .     |
	    // +---+---+---+---+---+---+---+---+---+---+-----------+
	
	    if (spalte >= 0 && spalte <= 4) { // auf gueltige Spalte kontrollieren
			if (wert > 4) {
				led.plot(spalte, 0) // obersten Stein (5) setzen
				wert = wert - 5 // im unteren Bereich (0 bis 4) weitermachen
			} else {
				led.unplot(spalte, 0) // obersten Stein loeschen
			}
		    if (wert >= 0 && wert <= 4) {
			    for (let Index = 0; Index < wert; Index++) {
				    led.plot(spalte, Index + 1) // benoetigte Steine setzen
			    }
                for (let Index = 0; Index <= 4 - wert; Index++) {
				    led.unplot(spalte, 4 - Index + 1) // uebrige Steine loeschen
			    }
		    } else {
			    // keine gueltige Ziffer
			    led.unplot(spalte, 0)
			    led.plot(spalte, 1)
			    led.unplot(spalte, 2)
			    led.plot(spalte, 3)
			    led.unplot(spalte, 4)
		    }
        }
    }
	
	/**
     * Zeige eine Ziffer in der angegebenen Spalte an.
     */
	//% blockId="zeigeZiffer" block="zeige Ziffer: Wert %wert, Spalte %spalte"
    export function zeigeZiffer(wert: number, spalte: number) {
		if (anzeige == anzeigen.tropfstein) {
			zeigeZifferTropfstein(wert, spalte)
		} else {
			zeigeZifferSoroban(wert, spalte)
		}
	}
	
	/**
     * Zeige eine komplette Zahl an.
     */
    //% blockId="zeigeZahl" block="zeige Zahl: Wert %wert"
    export function zeigeZahl(wert: number) {
		let s = wert.toString() // Wert in String umwandeln
		
		if (s.length > 5) { // Zahl hat mehr Stellen, als das Display Spalten hat
            if (wert > 99999.4 || wert < -9999.5) { // Zahl auch mit Runden nicht darstellbar
    			basic.showString("#") // '#' als Fehlersymbol anzeigen
            } else { // es ist eine Kommazahl mit zu vielen Nachkommastellen
                let anz_vorkomma = s.indexOf(".") // Vorkommastellen, zaehlt ein ggf. vorhandenes '-'-Zeichen schon mit
                let verf_anz_nachkomma = 4 - anz_vorkomma // verfuegbare Nachkommastellen: 5 - Dezimalpunkt - Vorkommastellen inkl. '-'
                if (wert > -1 && wert < 1) { // Zahl zw. -1 und 1
					verf_anz_nachkomma += 1 // eine Nachkommastelle mehr zur Verfuegung stellen, da "0.nnn" dann als ".nnn" und "-0.nnn" als "-.nnn" geschrieben werden kann
				}
				wert = Math.roundWithPrecision(wert, verf_anz_nachkomma) // mit  hoechstmoeglicher Praezision runden            
				s = wert.toString() // gerundete Zahl zurueck in den String speichern
			}
		}
		
		if (s.length == 6) { // kann nur entstehen, wenn > -1 und < 1, nur dann wurde eine Nachkommestelle mehr zur Verfuegung gestellt
            s = s.replace("0.", ".") // ueberfluessige fuehrende 0 loeschen (auch hinter einem ggf. vorhandenem '-'-Zeichen) => String hat danach definitiv eine Laenge von 5
        }
	
		if (s.length <= 5) { // Zahl ist darstellbar, entweder von vorneherein oder gerundet		
			// rechtsbuendig formatieren
			if (s.charCodeAt(0) != 45) { // nicht negativ
				while (s.length < 5) {
					s = "0" + s // von links mit Nullen auffuellen
				}
			} else { // negativ
				let s2 = s.substr(1, s.length) // Vorzeichen entfernen
				while (s2.length < 4) { // Platz fuer Vorzeichen reservieren
					s2 = "0" + s2 // von links mit Nullen auffuellen
				}
				s = "-" + s2 // Vorzeichen wieder einfuegen
			}
    
			// ziffernweise darstellen
			for (let i = 0; i < s.length; i++) {
				let v = s.charCodeAt(i)
				if (v >= 48 && v <= 57) { // Ziffer
					zeigeZiffer(v - 48, i)
				} else if (v == 45) { // Vorzeichen
					led.plot(i, 2)
				} else if (v == 46) { // Dezimalpunkt
					led.plot(i, 3)
				}
			}
		}
	}
}
