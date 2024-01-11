Refresh
=======
IITC-Plugin for the game Ingress.


Usage
=====

![][image_button]
Instead of hammering "F5" use this button.

It will refresh portal informations without reloading the whole map.
This will save you a lof of time and data-transfers. Also you won't lost current session data just for forcing a map update.

- it rotates if the map is still loading
- it fades in after a refresh call to prevent you from doing to much calls

Notes:
- regular IITC will refresh data every 5min
- ingress-intel-server won't give you realtime data
 



[image_button]: data:image/png;base64,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