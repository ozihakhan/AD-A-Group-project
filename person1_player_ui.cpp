#include "game.h"

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