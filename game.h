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

HANDLE console = GetStdHandle(STD_OUTPUT_HANDLE);
COORD CursorPosition;

char bike[4][4] = {
    {' ', '0', ' ', ' '},
    {'0', 'X', '0', ' '},
    {' ', '0', ' ', ' '},
    {'0', 'X', '0', ' '}
};

int bikePos = WIN_WIDTH / 2;

void gotoxy(int x, int y) {
    CursorPosition.X = x;
    CursorPosition.Y = y;
    SetConsoleCursorPosition(console, CursorPosition);
}

void setcursor(bool visible, DWORD size) {
    if (size == 0) size = 20;

    CONSOLE_CURSOR_INFO cursorInfo;
    cursorInfo.bVisible = visible;
    cursorInfo.dwSize = size;

    SetConsoleCursorInfo(console, &cursorInfo);
}

void drawBorder() {
    for (int i = 0; i < SCREEN_HEIGHT; i++) {
        for (int j = 0; j < 17; j++) {
            gotoxy(j, i);
            cout << "|";

            gotoxy(WIN_WIDTH - j, i);
            cout << "|";
        }
    }
}

void drawBike() {
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            gotoxy(bikePos + j, 22 + i);
            cout << bike[i][j];
        }
    }
}

void eraseBike() {
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            gotoxy(bikePos + j, 22 + i);
            cout << " ";
        }
    }
}