# linter-betty

This package will lint C source files in Atom with [Betty](https://github.com/holbertonschool/Betty).

## Installation

You will need to have [Betty](https://github.com/holbertonschool/Betty) installed on your system before trying to use this package.

After installing `Betty` on your system you can install this package by either searching for it within Atom's package installation section of the settings or by running the following command in a terminal:

```ShellSession
apm install linter-betty
```

_As this package only provides a service, you will need something to run it. As such, the [Linter](https://atom.io/packages/linter) package will be installed automatically for you if it isn't already installed. This will provide the user interface and run the linter for you._

### Setup

Once the package is installed you may need to specify the path to the `Betty` executables if Atom is not able to find it automatically.

You can do this from Atom's settings menu or by editing your `~/.atom/config.cson` file (choose Open Your Config in Atom's menu). If editing the file by hand you should modify/create a
section like the following:

```cson
"linter-betty":
  # Betty style path. Needs to be the full path to the betty-style perl script
  executablePath: "~/Betty/betty-style.pl"
  # Betty doc path. Needs to be the full path to the betty-doc perl script
  checkDocExecutablPath: "~/Betty/betty-doc.pl"
```
