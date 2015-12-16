# Fuzzyurl

Non-strict parsing, composition, and wildcard matching of URLs in
JavaScript.

## Introduction

Fuzzyurl provides two related functions: non-strict parsing of URLs or
URL-like strings into their component pieces (protocol, username, password,
hostname, port, path, query, and fragment), and fuzzy matching of URLs
and URL patterns.

Specifically, URLs that look like this:

    [protocol ://] [username [: password] @] [hostname] [: port] [/ path] [? query] [# fragment]

Fuzzyurls can be constructed using some or all of the above
fields, optionally replacing some or all of those fields with a `*`
wildcard if you wish to use the Fuzzyurl as a URL mask.


## Parsing URLs

    > Fuzzyurl.fromString("https://api.example.com/users/123?full=true")
    Fuzzyurl {
      protocol: 'https',
      username: undefined,
      password: undefined,
      hostname: 'api.example.com',
      port: undefined,
      path: '/users/123',
      query: 'full=true',
      fragment: undefined }


## Constructing URLs

    > var f = new Fuzzyurl({hostname: "example.com", protocol: "http", port: "8080"});
    > f.toString()
    'http://example.com:8080'


## Matching URLs

Fuzzyurl supports wildcard matching:

* `*` matches anything, including `null`.
* `foo*` matches `foo`, `foobar`, `foo/bar`, etc.
* `*bar` matches `bar`, `foobar`, `foo/bar`, etc.

Path and hostname matching allows the use of a greedier wildcard `**` in
addition to the naive wildcard `*`:

* `*.example.com` matches `filsrv-01.corp.example.com` but not `example.com`.
* `**.example.com` matches `filsrv-01.corp.example.com` and `example.com`.
* `/some/path/*` matches `/some/path/foo/bar` and `/some/path/`
   but not `/some/path`
* `/some/path/**` matches `/some/path/foo/bar` and `/some/path/`
   and `/some/path`

The `Fuzzyurl.mask` function aids in the creation of URL masks.

    > Fuzzyurl.mask()
    Fuzzyurl { protocol: '*', username: '*', password: '*', hostname: '*',
      port: '*', path: '*', query: '*', fragment: '*' }

    > Fuzzyurl.matches(Fuzzyurl.mask(), "http://example.com:8080/foo/bar")
    true

    > var mask = Fuzzyurl.mask({path: "/a/b/**"})
    > Fuzzyurl.matches(mask, "https://example.com/a/b/")
    true
    > Fuzzyurl.matches(mask, "git+ssh://jen@example.com/a/b")
    true
    > Fuzzyurl.matches(mask, "https://example.com/a/bar")
    false

`Fuzzyurl.bestMatch`, given a list of URL masks and a URL, will return
the index of the mask which most closely matches the URL:

    > var masks = ["/foo/*", "/foo/bar", Fuzzyurl.mask()];
    > Fuzzyurl.bestMatch(masks, "http://example.com/foo/bar");
    0


## Authorship and License

Fuzzyurl is copyright 2015, Pete Gamache.

Fuzzyurl is released under the MIT License.  See LICENSE.txt.

If you got this far, you should probably follow me on Twitter.
[@gamache](https://twitter.com/gamache)
