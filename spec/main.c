#include <stdio.h>
#include <stdlib.h>
#include "queue.h"

int push_queue(Queue **, char *);

void print_queue(Queue *);
void free_queue(Queue *);

void *another(void (*ptr)(int, int))
{
	(void)ptr;
	return (NULL);
}

/**
 * test1 -
 * Description:
 * Return:
*/
int **test1(void)
{
	return (NULL);
}

/**
 * test2 -
 * Description:
 * Return:
*/
inline int test2(void)
{
	return (0);
}

/**
 * no_return_type -
 * @test:
 * Description:
*/
void no_return_type(int test)
{
	(void)test;
	return;
}

/**
 * test3 -
 * Description:
 * Return:
*/
int test3(void)
{
	return (0);
}

/**
 * main -
 * @ac:
 * @av:
 * Description:
 * Return:
*/
int main(int ac, char **av)
{
	(void)ac;
	(void)av;
	return (1);
}
