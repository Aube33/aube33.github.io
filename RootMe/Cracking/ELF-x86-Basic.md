---
layout: default
title: RootMe
permalink: /cracking/elf-x86-basic
---

# ELF x86 - Basic

## Statement
Find the validation password.

## Analyze
Let's download the file (ch2.zip). After unzipping the file ch2.bin was extracted, and if we execute it:
```bash
aube@BigMakOS: Downloads$ ./ch2.bin 
############################################################
##        Bienvennue dans ce challenge de cracking        ##
############################################################

username: aube
Bad username
```
Our objective is to explore the code of the executable to find the correct username.

## Exploitation
So we need to decompile our program, for that I will use [Ghidra](https://ghidra-sre.org/).

Import the .bin into Ghidra, analyze it and we obtain decompiled program translated in pseudo-code C-like, let's analyze the decompiled code:
```c
undefined4 main(void)

{
  char *pcVar1;
  int iVar2;
  undefined4 local_10;
  
  puts("############################################################");
  puts("##        Bienvennue dans ce challenge de cracking        ##");
  puts("############################################################\n");
  printf("username: "); // Program asks username
  pcVar1 = (char *)getString(local_10); // Gets user input
  iVar2 = strcmp(pcVar1,"john"); // Compares user input with "john"
  if (iVar2 == 0) {
    printf("password: "); // Asks password
    pcVar1 = (char *)getString(pcVar1); // Get user input
    iVar2 = strcmp(pcVar1,"the ripper"); // Compare user input with "the ripper"
    if (iVar2 == 0) {
      printf("Bien joue, vous pouvez valider l\'epreuve avec le mot de passe : %s !\n","xxxxxxxxx"); // And returns the flag
    }
    else {
      puts("Bad password");
    }
  }
  else {
    puts("Bad username");
  }
  return 0;
}
```
So we found that username is `john`, password is `the ripper` and our flag is `xxxxxxxxx` 


## How does it work ?
Ghidra supports many architectures (x86, x64, MIPS, ARM, ...). It reads machine code and converts it into assembly code using its **Disassembler**, after that it translates assembly code in C-like pseudo-code with its **Decompiler**.