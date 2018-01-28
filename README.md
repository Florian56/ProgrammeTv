# gladys-programmetv

## Pré-requis

Nécessite Gladys >= 3.0.0.

## Installation

* Installer le module dans le store sur Gladys.
* Rebooter Gladys.
* Dans les paramètres globaux de Gladys, changer si besoin ce paramètre pour exclure des chaines à récupérer.
    * `PROGRAMMETV_CHAINES_EXCLUES` : `TF1,France 2`

## Utilisation

Par exemple, pour annoncer le programme du soir sur une Sonos :

```javascript
gladys.modules.programmetv.exec()
    .then(programmes => {
        var texte = '';
        var nomChaines = Object.getOwnPropertyNames(programmes);
        for (var i = 0; i < nomChaines.length; i++) {
            texte += `Sur ${nomChaines[i]}/`;
            texte += `${programmes[nomChaines[i]].nomProgramme}/`;
            texte += `${programmes[nomChaines[i]].typeProgramme}.`;
        }
        
        return gladys.modules['speak-sonos'].say({language : 'fr', text : texte, device : 2});
    });
```
