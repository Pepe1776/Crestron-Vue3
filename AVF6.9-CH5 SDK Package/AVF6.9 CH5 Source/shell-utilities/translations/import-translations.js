const fs = require('fs');
const path = require('path');
const xpath = require('xpath')
const dom = require('xmldom').DOMParser;

/**
 * Format the output json containing special characters
 * These special characters will be replaced with values that support i18n
 * @param {*} jsonObjectInput 
 */
function process(jsonObjectInput) {
    let output = {};
    const keys = Object.keys(jsonObjectInput);
    const arrayOfChars = [{
        findKey: "-",
        replaceKey: "Minus",
        type: "endsWith"
    },
    {
        findKey: "-",
        replaceKey: "",
        type: "includes"
    },
    {
        findKey: "+",
        replaceKey: "Plus",
        type: "endsWith"
    },
    {
        findKey: "+",
        replaceKey: "",
        type: "includes"
    },
    {
        findKey: "_",
        replaceKey: "",
        type: "includes"
    },
    {
        findKey: "(",
        replaceKey: "",
        type: "includes"
    },
    {
        findKey: ")",
        replaceKey: "",
        type: "includes"
    },
    {
        findKey: ".",
        replaceKey: "",
        type: "includes"
    }

    ];

    for (let i = 0; i < keys.length; i++) {
        let tempOutput = keys[i];
        for (let j = 0; j < arrayOfChars.length; j++) {
            if (arrayOfChars[j].type === "includes") {
                if (String(tempOutput).includes(arrayOfChars[j].findKey)) {
                    tempOutput = String(tempOutput).split(arrayOfChars[j].findKey).join(arrayOfChars[j].replaceKey);
                }
            } else if (arrayOfChars[j].type === "endsWith") {
                if (String(tempOutput).endsWith(arrayOfChars[j].findKey)) {
                    tempOutput = String(tempOutput).split(arrayOfChars[j].findKey).join(arrayOfChars[j].replaceKey);
                }
            }
        }
        output[tempOutput] = jsonObjectInput[keys[i]];
    }
    return output;
}

/**
 * This function is called to convert the xml files to JSON translation files.
 */
function createTranslationFiles() {
    const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

    const getXmlFiles = source =>
        fs.readdirSync(source, { withFileTypes: false })
            .filter(filent => filent.match(new RegExp(`.*(xml)`, 'ig')))
            .sort();

    const avfroot = "./app/config/TranslationFiles";
    const dir = './app/project/assets/data/translation';
    try { fs.mkdirSync(dir) }
    catch { }

    let dirs = getDirectories(avfroot);

    for (let idx = 0; idx < dirs.length; idx++) {
        let source_langpath = path.join(avfroot, dirs[idx]);
        let lang = dirs[idx];
        let xmlfiles = getXmlFiles(source_langpath);
        let output = {};
        let langForFileName = "";

        for (let jdx = 0; jdx < xmlfiles.length; jdx++) {
            let xmlfile = path.join(avfroot, lang, xmlfiles[jdx]);

            // console.log(xmlfile);

            let input = fs.readFileSync(xmlfile, 'utf8');
            let doc = new dom().parseFromString(input);
            let nodes = xpath.select("/lang/lookup", doc);
            langForFileName = xpath.select1("/lang/@locale", doc).value;

            for (let i = 0; i < nodes.length; i++) {
                output[nodes[i].getAttribute('key')] = nodes[i].firstChild.data;
            }
        }
        output["language"] = lang;

        langForFileName = langForFileName.split("_").join("-");
        let jsonfile = path.join(dir, `${langForFileName}.json`);
        fs.writeFileSync(jsonfile, JSON.stringify(process(output)));
    }
    console.log("Translation files generated successfully.");
}

createTranslationFiles();