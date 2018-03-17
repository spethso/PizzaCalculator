# PizzaCalculator
[![license](https://img.shields.io/badge/License-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

FIUS Pizza Calculator

##Running FIUS Pizza Calculator
There are two methods of installing and running the FIUS Pizza Calculator: Docker and manual

### Running with Docker
If you have docker installed you can run the FIUS Pizza Calculator like so:
> docker run -p 0.0.0.0:<port>:80 neumantm/pizza-calculator
This will run the container and publish the app to everybody in the network on the port <port>.

### Installing and running manually:
#### Prerequisite
- [npm](https://github.com/npm/npm) (current Version)
- [optional] [nvm](https://github.com/creationix/nvm) (current Version)

#### Setup

> git clone git@github.com:mee4895/PizzaCalculator.git <br>
> cd PizzaCalculator <br>
> npm install

#### Start

> npm start
