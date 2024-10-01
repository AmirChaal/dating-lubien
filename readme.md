# INSTALLATION
## Option 1
- [Installez Node.JS](https://nodejs.org/en/download/package-manager)
- Créez un dossier, et lancez un terminal à l'intérieur (Clique Droit > Ouvrir dans le Terminal)
- Entrez `git clone git@github.com:AmirChaal/dating-lubien.git`
- Entrez `npm i`
## Option 2
- Vous pouvez simplement m'appeler sur Discord : `recro_`
# CONFIGURATION
Déposez vos images de personnages, vos fonds et vos fichiers .json dans le dossier `vos-fichiers`
## Fichier .env
Le fichier `.env` vous permet de configurer l'application.
- `VITE_NOM_DE_JSON_HISTOIRE` : Nom du fichier .json qui sera utilisé.
- `VITE_IDENTIFIANT_CHAPITRE_INITIAL` : Identifiant du chapitre de départ.
- Les variables restantes sont les chemins vers les dossiers dans lesquels l'application ira chercher vos fichiers. (Assurez vous que les valeurs de ces variables se termine bien par `/`)
# LANCEMENT
- Entrez `npm run dev`
- Vous pouvez ensuite accéder à l'application à l'URL indiqué dans le terminal.
# ARRÊT
- `CTRL` + `C`