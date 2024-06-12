# Dockerfile

# Gunakan image PHP resmi dengan Apache
FROM php:8.1-apache

# Install dependensi yang diperlukan
RUN apt-get update && apt-get install -y \
  build-essential \
  libpng-dev \
  libjpeg-dev \
  libfreetype6-dev \
  libonig-dev \
  libxml2-dev \
  zip \
  unzip \
  git \
  curl \
  nodejs \
  npm

# Install ekstensi PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy file aplikasi
COPY . .

# Install dependensi aplikasi
RUN composer install
RUN npm install && npm run build

# Copy konfigurasi Apache
COPY ./docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Enable mod_rewrite
RUN a2enmod rewrite

# Set permissions
RUN chown -R www-data:www-data /var/www \
  && chmod -R 755 /var/www/storage

# Expose port 80
EXPOSE 80

# Jalankan Apache
CMD ["apache2-foreground"]
