# Camera Autorestart

Node script to restart an IP camera when FTP sending does not work anymore.

## The problem
I do not know why, but after a given amount of time, FTP sending does not work anymore on a FDT IP camera I manage.
On camera movements, images are simply not sent.
And the `testftp` command does not return anything at all (the request never ends).

## The solution
This scripts checks, every hour, if the camera responds to the `testftp` request, the camera is rebooted with the `sysreboot` command.
## How to use
- Install Node
- Clone repo
- Copy `.env-example` to `.env`
- Modify values in `.env` to match your situation 
- Launch the script with some process manager, PM2 for example
