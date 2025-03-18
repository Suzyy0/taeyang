DROP DATABASE IF EXISTS uv_protection_app;

-- Create database
CREATE DATABASE IF NOT EXISTS uv_protection_app;
USE uv_protection_app;

-- Drop tables if they exist (in correct order to respect foreign key constraints)
DROP TABLE IF EXISTS exposure_records;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS uv_index_records;
DROP TABLE IF EXISTS protection_recommendations;
DROP TABLE IF EXISTS australian_locations;

-- Database schema for UV Protection Application

-- Australian locations table (based on postcodes data)
CREATE TABLE australian_locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postcode INT,
  locality VARCHAR(100),
  state VARCHAR(5),
  longitude DECIMAL(10, 7),
  latitude DECIMAL(10, 7),
  region VARCHAR(10),
  altitude DECIMAL(10, 4) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_postcode (postcode),
  INDEX idx_locality_state (locality, state),
  INDEX idx_coordinates (latitude, longitude)
);

-- UV index records table
CREATE TABLE uv_index_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT,
  uv_index DECIMAL(5, 2),
  uv_level ENUM('Low', 'Moderate', 'High', 'Very High', 'Extreme'),
  measured_at TIMESTAMP,
  forecast_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES australian_locations(id) ON DELETE CASCADE,
  INDEX idx_location_date (location_id, forecast_date)
);

-- User settings and profiles
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE,
  name VARCHAR(100),
  skin_type ENUM('I', 'II', 'III', 'IV', 'V', 'VI'),
  default_location_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (default_location_id) REFERENCES australian_locations(id) ON DELETE SET NULL
);

-- User exposure tracking
CREATE TABLE exposure_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  location_id INT,
  exposure_start TIMESTAMP,
  exposure_end TIMESTAMP,
  uv_index_avg DECIMAL(5, 2),
  protection_used TEXT, -- JSON array of protection methods used
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES australian_locations(id)
);

-- Protection recommendations table
CREATE TABLE protection_recommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uv_min DECIMAL(5, 2),
  uv_max DECIMAL(5, 2),
  sunscreen_spf VARCHAR(20),
  hat_recommended BOOLEAN,
  hat_type VARCHAR(50),
  sunglasses_recommended BOOLEAN,
  clothing_recommended BOOLEAN,
  clothing_type VARCHAR(50),
  shade_recommended BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default protection recommendations
INSERT INTO protection_recommendations 
  (uv_min, uv_max, sunscreen_spf, hat_recommended, hat_type, sunglasses_recommended, clothing_recommended, clothing_type, shade_recommended)
VALUES 
  (0, 2, 'SPF 30+', false, 'None', false, false, 'None', false),
  (3, 5, 'SPF 30+', true, 'Cap or Hat', true, false, 'None', false),
  (6, 7, 'SPF 50+', true, 'Wide-brimmed Hat', true, true, 'Long sleeves', false),
  (8, 10, 'SPF 50+', true, 'Wide-brimmed Hat', true, true, 'Long sleeves', true),
  (11, 20, 'SPF 50+', true, 'Wide-brimmed Hat', true, true, 'Long sleeves & pants', true);
  
  SHOW TABLES;