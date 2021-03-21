### Hexlet tests and linter status:
[![Actions Status](https://github.com/Kassy-8/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/Kassy-8/frontend-project-lvl2/actions)
![Test workflow](https://github.com/Kassy-8/frontend-project-lvl2/actions/workflows/nodeTest.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/dc9547b8367c701e3de5/maintainability)](https://codeclimate.com/github/Kassy-8/frontend-project-lvl2/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dc9547b8367c701e3de5/test_coverage)](https://codeclimate.com/github/Kassy-8/frontend-project-lvl2/test_coverage)

# Compare tool for data structures
*This repository is created as part of education on [Hexlet](https://hexlet.io).*

Command line utility for comparison two data files and getting differences between them. It supports next file formats:
* Supports next file formats: JSON, YAML.
* Can provide report in stylish, plain on json formats.


## Setup:

Clone repository:

`git clone git@github.com:Kassy-8/frontend-project-lvl2.git`

Install dependencies

`npm ci`

Install games as global package:

`npm link`

## Usage
```
Usage: gendiff [options] <filepath1> <filepath2>

Options:
  -v, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           output usage information
```
You can use relative or absolute paths.

Example for JSON-files, output format - stylish (by default):

```
gendiff file1.json file2.json

{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    .....
}
```
[![asciicast](https://asciinema.org/a/OSZlXbQJtmQPQbwBt2hhBPRV9.svg)](https://asciinema.org/a/OSZlXbQJtmQPQbwBt2hhBPRV9)

Example for YAML-files, output format - plain:

```
gendiff -f plain file1.yml file2.yml
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
...
```

[![asciicast](https://asciinema.org/a/eVzhc1jk5YeeIpc7AzSnoAmzH.svg)](https://asciinema.org/a/eVzhc1jk5YeeIpc7AzSnoAmzH)

Example for JSON-files, output format - JSON:
```
gendiff - f json file1.json file2.json

[{"key":"common","type":"unchanged","value":[{"key":"follow","type":"added","value":false},{"key":"setting1","type":"unchanged","value":"Value 1"},{"key":"setting2","type":"removed","value":200},{"key":"setting3","type":"update","valueBefore":true,"valueAfter":null},{"key":"setting4","type":"added","value":"blah blah"},{"key":"setting5","type":"added","value":{"key5":"value5"}} ...]
```
[![asciicast](https://asciinema.org/a/KbYJZVzu80GnmMIFqnGtyVF2T.svg)](https://asciinema.org/a/KbYJZVzu80GnmMIFqnGtyVF2T)
