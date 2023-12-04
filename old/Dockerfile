# Use an official PHP runtime as a parent image
FROM php:7.2-apache

# Set the working directory in the container to /var/www/html
WORKDIR /var/www/html

# Copy the PHP files into the image
COPY . /var/www/html

# Install necessary packages and enable mod_rewrite
RUN apt-get update && \
    apt-get upgrade -y && \
    a2enmod rewrite

# Make port 80 available to the world outside this container
EXPOSE 80

# Run Apache in the foreground
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]