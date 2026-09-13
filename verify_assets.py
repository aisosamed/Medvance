import urllib.request, urllib.error, ssl
ctx = ssl._create_unverified_context()
urls = [
    'https://www.medvanceng.com/',
    'https://www.medvanceng.com/script.js',
    'https://www.medvanceng.com/styles.css',
    'https://www.medvanceng.com/styles/styles.css',
    'https://www.medvanceng.com/scripts/index.js',
]
for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, context=ctx, timeout=20)
        print('URL=%s HTTP=%s FINAL=%s TYPE=%s' % (url, resp.status, resp.geturl(), resp.headers.get('Content-Type')))
    except urllib.error.HTTPError as e:
        print('URL=%s HTTP_ERROR=%s FINAL=%s TYPE=%s' % (url, e.code, e.geturl(), e.headers.get('Content-Type')))
    except Exception as e:
        print('URL=%s EXC=%s' % (url, type(e).__name__ + ': ' + str(e)))

home_req = urllib.request.Request('https://www.medvanceng.com/', headers={'User-Agent': 'Mozilla/5.0'})
home_resp = urllib.request.urlopen(home_req, context=ctx, timeout=20)
home = home_resp.read().decode('utf-8', errors='ignore')
print('HAS_OLD_SCRIPT_REF=%s' % ('<script src="./script.js"></script>' in home))
print('HAS_NEW_SCRIPT_REF=%s' % ('<script src="./scripts/index.js" defer></script>' in home))
print('HAS_STYLE_REF=%s' % ('<link rel="stylesheet" href="./styles/styles.css" />' in home))
print('HAS_ROOT_STYLE_REF=%s' % ('<link rel="stylesheet" href="./styles.css" />' in home))
