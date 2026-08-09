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


int enemyY[2];
int enemyX[2];
int enemyFlag[2];
int score = 0;

void genEnemy(int ind) {
    enemyX[ind] = 17 + rand() % (WIN_WIDTH - 33);
}

void drawEnemy(int ind) {
    if (enemyFlag[ind] == 1) {
        gotoxy(enemyX[ind], enemyY[ind]);     cout << "****";
        gotoxy(enemyX[ind], enemyY[ind] + 1); cout << " ** ";
        gotoxy(enemyX[ind], enemyY[ind] + 2); cout << "****";
        gotoxy(enemyX[ind], enemyY[ind] + 3); cout << " ** ";
    }
}

void eraseEnemy(int ind) {
    if (enemyFlag[ind] == 1) {
        gotoxy(enemyX[ind], enemyY[ind]);     cout << "    ";
        gotoxy(enemyX[ind], enemyY[ind] + 1); cout << "    ";
        gotoxy(enemyX[ind], enemyY[ind] + 2); cout << "    ";
        gotoxy(enemyX[ind], enemyY[ind] + 3); cout << "    ";
    }
}

void updateScore() {
    gotoxy(WIN_WIDTH + 7, 5);
    cout << "Score: " << score << "   ";
}

void resetEnemy(int ind) {
    eraseEnemy(ind);
    enemyY[ind] = 1;
    genEnemy(ind);

    score++;
    updateScore();
}

int collision() {
    for (int i = 0; i < 2; i++) {
        bool enemyReachedBike =
            enemyFlag[i] == 1 && enemyY[i] + 3 >= 22;

        bool horizontalCollision =
            enemyX[i] <= bikePos + 3 &&
            enemyX[i] + 3 >= bikePos;

        if (enemyReachedBike && horizontalCollision) {
            return 1;
        }
    }

    return 0;
}

void gameOver() {
    system("cls");

    cout << "\n";
    cout << "\t\t--------------------------\n";
    cout << "\t\t-------- Game Over -------\n";
    cout << "\t\t--------------------------\n\n";
    cout << "\t\tFinal Score: " << score << "\n\n";
    cout << "\t\tPress any key to return to menu.";

    getch();
}

void play() {
    bikePos = WIN_WIDTH / 2;
    score = 0;

    enemyFlag[0] = 1;
    enemyFlag[1] = 1;

    enemyY[0] = 1;
    enemyY[1] = -10;   // prevents both enemies appearing together

    system("cls");

    drawBorder();
    genEnemy(0);
    genEnemy(1);
    updateScore();

    gotoxy(WIN_WIDTH + 7, 2);  cout << "Bike Race Game";
    gotoxy(WIN_WIDTH + 6, 4);  cout << "----------";
    gotoxy(WIN_WIDTH + 7, 12); cout << "Control Keys";
    gotoxy(WIN_WIDTH + 6, 13); cout << "------------";
    gotoxy(WIN_WIDTH + 7, 14); cout << "A - Move Left";
    gotoxy(WIN_WIDTH + 7, 15); cout << "D - Move Right";
    gotoxy(WIN_WIDTH + 7, 16); cout << "Esc - Exit Game";

    gotoxy(18, 5);
    cout << "Press any key to start racing!";
    getch();

    gotoxy(18, 5);
    cout << "                              ";

    while (true) {
        if (kbhit()) {
            char ch = getch();

            if ((ch == 'a' || ch == 'A') && bikePos > 18) {
                bikePos -= 4;
            }

            if ((ch == 'd' || ch == 'D') && bikePos < 50) {
                bikePos += 4;
            }

            if (ch == 27) {
                return;
            }
        }

        drawBike();
        drawEnemy(0);
        drawEnemy(1);

        if (collision() == 1) {
            gameOver();
            return;
        }

        Sleep(50);

        eraseBike();
        eraseEnemy(0);
        eraseEnemy(1);

        enemyY[0]++;
        enemyY[1]++;

        if (enemyY[0] > SCREEN_HEIGHT - 4) {
            resetEnemy(0);
        }

        if (enemyY[1] > SCREEN_HEIGHT - 4) {
            resetEnemy(1);
        }
    }
}

int main() {
    setcursor(false, 0);
    srand((unsigned)time(NULL));

    while (true) {
        system("cls");

        gotoxy(10, 5);  cout << " -------------------------- ";
        gotoxy(10, 6);  cout << " |     BIKE RACE GAME     | ";
        gotoxy(10, 7);  cout << " -------------------------- ";
        gotoxy(10, 9);  cout << "1. Start Game";
        gotoxy(10, 10); cout << "2. Exit";
        gotoxy(10, 12); cout << "Select option: ";

        char option = getche();

        if (option == '1') {
            play();
        }
        else if (option == '2') {
            return 0;
        }
    }
}