#ifndef GAME_H
#define GAME_H

#include <iostream>
#include <conio.h>
#include <windows.h>
#include <ctime>
#include <cstdlib>

using namespace std;

#define SCREEN_WIDTH 90
#define SCREEN_HEIGHT 26
#define WIN_WIDTH 70

extern HANDLE console;
extern COORD CursorPosition;

extern int enemyY[2];
extern int enemyX[2];
extern int enemyFlag[2];

extern char bike[4][4];
extern int bikePos;
extern int score;

void gotoxy(int x, int y);
void setcursor(bool visible, DWORD size);

void drawBorder();
void drawBike();
void eraseBike();

void genEnemy(int ind);
void drawEnemy(int ind);
void eraseEnemy(int ind);
void resetEnemy(int ind);
void updateScore();

int collision();
void gameOver();
void play();

#endif