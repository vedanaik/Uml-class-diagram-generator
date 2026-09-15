# UML Class Diagram Generator

An interactive web-based **UML Class Diagram Generator** built with React. The application allows users to visually design UML class diagrams, define classes, attributes, methods, and relationships, and automatically generate a structured Java project from the designed architecture.

The generated Java source code is organized into **separate `.java` files for each UML class**, with a project explorer similar to modern code editors.

---

## Features

### 1. Interactive UML Class Diagram

* Create UML class diagrams visually.
* Add multiple classes to the canvas.
* Drag and reposition classes.
* Select classes directly from the diagram.
* View class names, stereotypes, attributes, and methods.
* Connect classes to represent relationships.
* Automatic relationship arrows between connected classes.
* Zoom, pan, and navigate the diagram.

### 2. Class Management

Users can create and edit UML classes with:

* Class name
* Stereotype
* Attributes
* Methods
* Visibility modifiers

Supported stereotypes include:

* `class`
* `interface`
* `abstract`
* `entity`
* `service`

### 3. Attribute Management

Each UML class can contain multiple attributes.

For every attribute, users can define:

* Visibility
* Attribute name
* Data type

Supported UML visibility symbols:

| Symbol | Visibility | Java        |
| ------ | ---------- | ----------- |
| `+`    | Public     | `public`    |
| `-`    | Private    | `private`   |
| `#`    | Protected  | `protected` |

### 4. Method Management

Methods can be added and edited for every class.

Each method supports:

* Visibility
* Method name
* Return type
* Parameters

Example:

```text
+ login(): boolean
+ logout(): void
```

The corresponding Java code is generated automatically.

### 5. Class Relationships

Classes can be connected directly on the UML canvas.

Relationships are represented visually using arrows.

For example:

```text
User ───────────> Order
```

A relationship can also result in a corresponding reference in generated Java code.

Example:

```java
private Order order;
```

### 6. Automatic Java Code Generation

The application automatically converts the UML architecture into Java source code.

Instead of generating one large Java file, every UML class is converted into its own file.

For example:

```text
User.java
Order.java
Product.java
Payment.java
```

Generated files contain:

* Package declaration
* Class declaration
* Attributes
* Relationship fields
* Methods
* Java visibility modifiers

### 7. Project Explorer

The Java output is displayed using a project/file explorer.

The generated structure follows a standard Java project layout:

```text
uml-generated-project/
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── uml/
                        ├── User.java
                        ├── Order.java
                        ├── Product.java
                        └── Payment.java
```

Users can click individual Java files to view their source code.

### 8. Individual File Preview

Selecting a `.java` file displays only that file's generated code.

Example:

```java
package com.example.uml;

public class User {

    private String name;
    private String email;

    public boolean login() {
        // TODO: implement
    }

}
```

This makes the generated output easier to inspect and resembles a modern development environment.

### 9. Copy Generated Code

The **Copy** button allows the contents of the currently selected Java file to be copied to the clipboard.

This makes it easy to transfer generated code into:

* IntelliJ IDEA
* Eclipse
* Visual Studio Code
* NetBeans
* Other Java development environments

### 10. Export Complete Java Project

The application can export the generated project as a ZIP file.

Example:

```text
uml-generated-project.zip
```

The ZIP contains the complete directory structure:

```text
uml-generated-project/
│
├── README.md
│
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── uml/
                        ├── User.java
                        ├── Order.java
                        ├── Product.java
                        └── Payment.java
```

### 11. Reset Diagram

The **Reset** option restores the initial sample UML diagram.

This provides a quick way to return to the default state.

---

# Application Workflow

The application follows the workflow:

```text
Create UML Classes
        │
        ▼
Define Attributes & Methods
        │
        ▼
Connect Classes
        │
        ▼
Design UML Architecture
        │
        ▼
Generate Java Project
        │
        ▼
Project Explorer
        │
        ├── User.java
        ├── Order.java
        ├── Product.java
        └── Payment.java
        │
        ▼
Copy / Export Project
```

---

# Project Structure

The React application is organized as follows:

```text
uml-class-diagram-generator/
│
├── public/
│
├── src/
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

### Source Files

#### `src/main.jsx`

Contains the main application logic, including:

* React components
* UML class management
* React Flow canvas
* Node and edge management
* Attribute management
* Method management
* Java code generation
* Project file generation
* Project ZIP export
* Project explorer
* Code preview

#### `src/styles.css`

Contains the application's styling, including:

* Application layout
* Header
* Sidebar
* UML class cards
* Diagram styling
* Project explorer
* Java code editor
* Properties panel
* Buttons and controls
* Responsive visual styling

#### `package.json`

Contains:

* Project metadata
* npm scripts
* React dependencies
* React Flow
* Lucide icons
* JSZip
* Vite

---

# Generated Java Project Structure

The application uses the following Java package:

```text
com.example.uml
```

Therefore, generated source files are placed under:

```text
src/main/java/com/example/uml/
```

For example:

```text
src/main/java/com/example/uml/User.java
src/main/java/com/example/uml/Order.java
```

Each Java file contains the package declaration:

```java
package com.example.uml;
```

---

# Technologies Used

## Frontend

### React

Used to build the interactive user interface and application components.

### Vite

Used as the development server and build tool.

### React Flow

Used to create the interactive UML diagram canvas.

React Flow provides:

* Nodes
* Edges
* Dragging
* Connections
* Zooming
* Panning
* Mini-map
* Diagram controls

### Lucide React

Used for interface icons such as:

* Add
* Delete
* Download
* Copy
* Folder
* File
* Code
* Reset

### JSZip

Used to package the generated Java source files and directory structure into a downloadable ZIP file.

---

# Software Requirements

## Required Software

The following software is required to run the project.

### Node.js

Node.js version:

```text
18.x or later
```

Recommended:

```text
Node.js 20.x or later
```

### npm

npm is included with Node.js.

Check the installed versions:

```bash
node --version
npm --version
```

---

# Hardware Requirements

The application is lightweight and does not require specialized hardware.

### Minimum

* Processor: Dual-core CPU
* RAM: 4 GB
* Storage: 500 MB available space
* Internet connection: Required for initial dependency installation

### Recommended

* Processor: Intel Core i3 / AMD Ryzen 3 or better
* RAM: 8 GB or more
* Storage: 1 GB available space
* Modern web browser

---

# Supported Browsers

The application is intended for modern browsers such as:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

A Chromium-based browser such as Chrome or Edge is recommended.

---

# Installation

## 1. Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Navigate to the project directory:

```bash
cd uml-class-diagram-generator
```

---

## 2. Install Dependencies

Run:

```bash
npm install
```

This installs all required packages, including:

```text
React
React DOM
React Flow
Lucide React
JSZip
Vite
```

---

## 3. Start the Development Server

Run:

```bash
npm run dev
```

Vite will provide a local URL, normally similar to:

```text
http://localhost:5173
```

Open the URL in a web browser.

---

# Production Build

To create a production build:

```bash
npm run build
```

The generated production files will be placed inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# How to Use

## Step 1 — Create a Class

Click:

```text
+ Add Class
```

A new UML class will appear on the diagram.

---

## Step 2 — Edit Class Properties

Select the class.

The Properties panel allows you to modify:

```text
Class name
Stereotype
Attributes
Methods
```

---

## Step 3 — Add Attributes

Use the `+` button next to **Attributes**.

For example:

```text
- name: String
- email: String
- age: int
```

---

## Step 4 — Add Methods

Use the `+` button next to **Methods**.

For example:

```text
+ login(): boolean
+ logout(): void
```

---

## Step 5 — Connect Classes

Drag from one class connection point to another.

For example:

```text
User ───────────> Order
```

The relationship is stored in the diagram and considered during Java generation.

---

## Step 6 — View Generated Java

Select:

```text
Java Project
```

The project explorer will display the generated structure.

For example:

```text
uml-generated-project
└── src
    └── main
        └── java
            └── com.example.uml
                ├── User.java
                └── Order.java
```

---

## Step 7 — Open a Java File

Click a file such as:

```text
User.java
```

The generated source code will appear in the editor.

---

## Step 8 — Copy Code

Click:

```text
Copy
```

to copy the currently selected Java file.

---

## Step 9 — Export the Project

Click:

```text
Export Project ZIP
```

The application generates:

```text
uml-generated-project.zip
```

The ZIP can then be extracted and opened in a Java IDE.

---

# Example

Suppose the UML diagram contains:

```text
┌──────────────────────┐
│        User          │
├──────────────────────┤
│ - name: String       │
│ - email: String      │
├──────────────────────┤
│ + login(): boolean   │
│ + logout(): void     │
└──────────────────────┘
           │
           │ places
           ▼
┌──────────────────────┐
│        Order         │
├──────────────────────┤
│ - orderId: int       │
│ - total: double      │
├──────────────────────┤
│ + calculateTotal()   │
│   : double           │
└──────────────────────┘
```

The generated project becomes:

```text
uml-generated-project/
│
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── uml/
                        ├── User.java
                        └── Order.java
```

### `User.java`

```java
package com.example.uml;

public class User {

    private String name;
    private String email;

    private Order order;

    public boolean login() {
        // TODO: implement
    }

    public void logout() {
        // TODO: implement
    }

}
```

### `Order.java`

```java
package com.example.uml;

public class Order {

    private int orderId;
    private double total;

    private User user;

    public double calculateTotal() {
        // TODO: implement
    }

}
```

---

# Screenshots

Screenshots of the application interface can be added in this section.

## UML Diagram Interface

Add screenshot here:

```text
![UML Diagram Interface](screenshots/uml-diagram.png)
```

## Class Properties Panel

Add screenshot here:

```text
![Class Properties](screenshots/class-properties.png)
```

## Java Project Explorer

Add screenshot here:

```text
![Java Project Explorer](screenshots/java-project.png)
```

## Generated Java Code

Add screenshot here:

```text
![Generated Java Code](screenshots/generated-java.png)
```

## Project Export

Add screenshot here:

```text
![Exported Java Project](screenshots/exported-project.png)
```

> Create a `screenshots/` folder in the repository and place the corresponding images inside it.

---

# Future Enhancements

Possible future improvements include:

* More UML relationship types
* Inheritance support
* Interfaces and abstract classes
* Association, aggregation, and composition
* Multiplicity notation
* Automatic getters and setters
* Constructors
* Java package customization
* Java import generation
* Maven project generation
* Gradle project generation
* Java compilation validation
* Code syntax highlighting
* Editable generated code
* Multiple programming language generation
* PNG/SVG diagram export
* Save/load UML projects
* Database persistence
* Undo/redo support

---

# Limitations

The current version focuses on UML architecture visualization and Java source-code generation.

Generated methods contain placeholder implementations:

```java
// TODO: implement
```

The application does not currently implement the actual business logic of generated methods.

The generated project is primarily intended as a starting point for further development.

---

# License

This project is intended for educational and development purposes.

Add your preferred license here, for example:

```text
MIT License
```

---

# Author

**Veda**

UML Class Diagram Generator — React-based interactive UML design and Java project generation tool.
