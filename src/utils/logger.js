const config = require('../config');

/**
 * Logger utility for structured logging
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.currentLevel = this.levels[config.logging.level] || this.levels.info;
  }

  /**
   * Format log message with timestamp and level
   */
  format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      env: config.server.env,
      ...meta,
    };

    if (config.server.env === 'development') {
      return this.prettyPrint(logEntry);
    }
    return JSON.stringify(logEntry);
  }

  /**
   * Pretty print for development
   */
  prettyPrint(entry) {
    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[35m', // Magenta
      reset: '\x1b[0m',
    };

    const color = colors[entry.level] || colors.reset;
    return `${color}[${entry.timestamp}] ${entry.level.toUpperCase()}${colors.reset}: ${entry.message}${
      Object.keys(entry).length > 4 ? '\n' + JSON.stringify(entry, null, 2) : ''
    }`;
  }

  /**
   * Log error
   */
  error(message, meta = {}) {
    if (this.currentLevel >= this.levels.error) {
      console.error(this.format('error', message, meta));
    }
  }

  /**
   * Log warning
   */
  warn(message, meta = {}) {
    if (this.currentLevel >= this.levels.warn) {
      console.warn(this.format('warn', message, meta));
    }
  }

  /**
   * Log info
   */
  info(message, meta = {}) {
    if (this.currentLevel >= this.levels.info) {
      console.info(this.format('info', message, meta));
    }
  }

  /**
   * Log debug
   */
  debug(message, meta = {}) {
    if (this.currentLevel >= this.levels.debug) {
      console.debug(this.format('debug', message, meta));
    }
  }

  /**
   * Log HTTP request
   */
  http(req, res, duration) {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      this.error(message, meta);
    } else if (res.statusCode >= 400) {
      this.warn(message, meta);
    } else {
      this.info(message, meta);
    }
  }
}

module.exports = new Logger();
