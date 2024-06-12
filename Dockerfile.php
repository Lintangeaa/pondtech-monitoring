# Gunakan image resmi PHP 8.2 FPM
FROM php:8.2-fpm

# Install dependensi yang diperlukan untuk Laravel
RUN apt-get update && apt-get install -y \
  libzip-dev \
  zip \
  unzip \
  && docker-php-ext-install pdo_mysql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tambahkan pengguna dan grup untuk menghindari permission issues
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Set working directory di dalam container
WORKDIR /var/www/html

# Copy file composer.json dan composer.lock ke image Docker
COPY composer.json composer.lock ./

# Install dependensi PHP menggunakan Composer
RUN composer install --no-scripts --no-autoloader

# Copy seluruh proyek Laravel ke image Docker
COPY . .

# Tambahkan permission agar www-data (user PHP-FPM) dapat menulis ke storage Laravel
RUN chown -R www:www /var/www/html
RUN chmod -R 775 /var/www/html/storage

# Expose port 9000 untuk PHP-FPM
EXPOSE 9000

# Jalankan PHP-FPM
CMD ["php-fpm"]
