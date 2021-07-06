# gminer-status
A GMiner API stats page aggregator for monitoring multiple GMiner instances.

# Setup
1. You should be running GMiner (https://github.com/develsoftware/GMinerRelease) with --api [port] enabled.
1. This requires a webserver with PHP support to aggregate the data.
1. Place this code in a place accessible to your webserver.
1. Copy the file "config.inc.example.php" to "config.inc.php" and configure your hosts.
    * Add your hosts to the variable, replacing host with their ip address, or usually local machine name will work (it depends on your router).
    * The port should be whatever number you put in --api [port] in your gminer arguments.
    * For example: --api 9000 would be http://your-machine-name:9000/stat

# Usage
Just navigate to the location you placed the code. It should refresh the data from your miners every second if they are all online.
If there are any online it times out after the period specified in the config, so that will be your refresh rate.

![page example screenshot](https://github.com/nhorvath/gminer-status/blob/main/example.png?raw=true)

# Acknowledgements
Thank you to the GMiner team for providing your mining software, API, and a starting point for this little project.