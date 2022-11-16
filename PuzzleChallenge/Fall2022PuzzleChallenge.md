# Fall 2022 Puzzle Challenge
Team up and solve the puzzle to win a prize!

## Goal
Unlock the lockbox by entering the 4-digit combination.

## First Step
The first step is to decipher the instructions using ROT13.

ROT13 is a letter substitution cipher that replaces a letter with the **13th** letter after it in the alphabet. The transformation can be done using a lookup table, such as the following:

| Lookup | |
|-|-|
| **Input** | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz` |
| **Output** | `NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm` |

For example, the message `This message is secret` would be encoded as `Guvf zrffntr vf frperg`.

_Note that numeric digits and other characters/punctuation are not affected by the cipher - they should stay the same!_

### Encoded Instructions
Below are the encoded instructions. Decipher them with ROT13!

```
Five instructors are involved, each one holding a different piece of the puzzle. 

Instructor One holds digit A.
Instructor Two holds digit X.
Instructor Three holds digit Y.
Instructor Four holds digit Z.
Instructor Five holds the digit representing the order.

The order can be determined based on this mapping:
0: AXZY
1: AYXZ
2: XAZY
3: XZYX
4: YZAX
5: YXZA
6: ZAYX
7: ZYXA
8: XYAZ
9: YAXZ

For example, if

Instructor One gave you 8,
Instructor Two gave you 7,
Instructor Three gave you 0,
Instructor Four gave you 3,
and Instructor Five gave you 5,

you would have the following information:

A: 8
X: 7
Y: 0
Z: 3
Pattern: 5 (YXZA)

You could then determine the code: 0738!

Each instructor has a puzzle for you to complete. If you complete a puzzle for an instructor, they will give you their digit. Put the digits together to unlock the secret code!

Instructor One is Allie
Instructor Two is J
Instructor Three is Ralphie
Instructor Four is Jordan
Instructor Five is Zach
```
