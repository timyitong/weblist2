function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

// Example about how to define constants:
    // define("PI", 3.14);