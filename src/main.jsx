import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { createRoot } from "react-dom/client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType
} from "@xyflow/react";

import JSZip from "jszip";

import {
  Box,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Download,
  FileCode2,
  Folder,
  FolderOpen,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Trash2
} from "lucide-react";

import "@xyflow/react/dist/style.css";
import "./styles.css";


/* =========================================================
   CONFIG
========================================================= */

const PACKAGE_NAME = "com.example.uml";


/* =========================================================
   INITIAL UML CLASSES
========================================================= */

const initialClasses = [
  {
    id: "user",
    name: "User",
    stereotype: "class",

    attributes: [
      {
        visibility: "private",
        name: "name",
        type: "String"
      },
      {
        visibility: "private",
        name: "email",
        type: "String"
      }
    ],

    methods: [
      {
        visibility: "public",
        name: "login",
        returnType: "boolean",
        params: ""
      },
      {
        visibility: "public",
        name: "logout",
        returnType: "void",
        params: ""
      }
    ],

    position: {
      x: 100,
      y: 100
    }
  },

  {
    id: "order",
    name: "Order",
    stereotype: "class",

    attributes: [
      {
        visibility: "private",
        name: "orderId",
        type: "int"
      },
      {
        visibility: "private",
        name: "total",
        type: "double"
      }
    ],

    methods: [
      {
        visibility: "public",
        name: "calculateTotal",
        returnType: "double",
        params: ""
      }
    ],

    position: {
      x: 500,
      y: 280
    }
  }
];


const initialEdges = [
  {
    id: "user-order",
    source: "user",
    target: "order",
    label: "places",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  }
];


/* =========================================================
   HELPERS
========================================================= */

function safeClassName(name) {
  const cleaned = (name || "UnnamedClass")
    .replace(/[^a-zA-Z0-9_$]/g, "");

  return cleaned || "UnnamedClass";
}


function visibilitySymbol(visibility) {
  if (visibility === "private") return "-";
  if (visibility === "protected") return "#";
  return "+";
}


function javaVisibility(visibility) {
  if (visibility === "private") return "private";
  if (visibility === "protected") return "protected";
  return "public";
}


/* =========================================================
   JAVA GENERATION
========================================================= */

function generateJavaClass(currentClass, classes, edges) {

  const className = safeClassName(currentClass.name);

  /*
    Find classes connected to this class.
  */

  const relatedClasses = edges
    .filter(
      edge =>
        edge.source === currentClass.id ||
        edge.target === currentClass.id
    )
    .map(edge => {

      const otherId =
        edge.source === currentClass.id
          ? edge.target
          : edge.source;

      return classes.find(c => c.id === otherId);
    })
    .filter(Boolean);


  /*
    Remove duplicate relationships.
  */

  const uniqueRelations = relatedClasses.filter(
    (item, index, array) =>
      array.findIndex(x => x.id === item.id) === index
  );


  /*
    Generate normal attributes.
  */

  const attributes =
    currentClass.attributes
      .map(attribute => {

        return `    ${javaVisibility(attribute.visibility)} ${attribute.type || "String"} ${attribute.name || "field"};`;

      })
      .join("\n");


  /*
    Generate relationship fields.

    Example:

    private Order order;
  */

  const relationshipFields =
    uniqueRelations
      .filter(
        relation =>
          safeClassName(relation.name) !== className
      )
      .map(relation => {

        const relationClass =
          safeClassName(relation.name);

        const variableName =
          relationClass.charAt(0).toLowerCase() +
          relationClass.slice(1);

        return `    private ${relationClass} ${variableName};`;

      })
      .join("\n");


  /*
    Generate methods.
  */

  const methods =
    currentClass.methods
      .map(method => {

        return `    ${javaVisibility(method.visibility)} ${method.returnType || "void"} ${method.name || "method"}(${method.params || ""}) {
        // TODO: implement
    }`;

      })
      .join("\n\n");


  const bodyParts = [];

  if (attributes) {
    bodyParts.push(attributes);
  }

  if (relationshipFields) {
    bodyParts.push(relationshipFields);
  }

  if (methods) {
    bodyParts.push(methods);
  }


  const body =
    bodyParts.length > 0
      ? bodyParts.join("\n\n")
      : "    // No members defined";


  return `package ${PACKAGE_NAME};

public class ${className} {

${body}

}
`;
}


/* =========================================================
   BUILD JAVA PROJECT FILES
========================================================= */

function buildGeneratedFiles(classes, edges) {

  return classes.map(cls => {

    const fileName =
      `${safeClassName(cls.name)}.java`;

    const packagePath =
      PACKAGE_NAME.replace(/\./g, "/");

    return {

      name: fileName,

      path:
        `src/main/java/${packagePath}/${fileName}`,

      content:
        generateJavaClass(
          cls,
          classes,
          edges
        )
    };
  });
}


/* =========================================================
   UML NODE
========================================================= */

function UmlNode({ data }) {

  return (

    <div className="uml-node">

      <Handle
        type="target"
        position={Position.Left}
        className="uml-handle"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="uml-handle"
      />

      <div className="uml-header">

        {data.stereotype &&
          data.stereotype !== "class" && (

            <div className="stereotype">
              «{data.stereotype}»
            </div>

          )}

        <strong>
          {data.name}
        </strong>

      </div>


      <div className="uml-section">

        {(data.attributes || []).map(
          (attribute, index) => (

            <div
              className="uml-line"
              key={index}
            >
              <span>
                {visibilitySymbol(
                  attribute.visibility
                )}
              </span>

              {" "}
              {attribute.name}: {attribute.type}
            </div>

          )
        )}

      </div>


      <div className="uml-section">

        {(data.methods || []).map(
          (method, index) => (

            <div
              className="uml-line"
              key={index}
            >

              <span>
                {visibilitySymbol(
                  method.visibility
                )}
              </span>

              {" "}
              {method.name}():
              {" "}
              {method.returnType}

            </div>

          )
        )}

      </div>

    </div>
  );
}


const nodeTypes = {
  uml: UmlNode
};


/* =========================================================
   TREE ROW
========================================================= */

function TreeRow({
  icon,
  label,
  open,
  onClick,
  level
}) {

  return (

    <button
      className="tree-row"
      style={{
        paddingLeft:
          10 + level * 20
      }}
      onClick={onClick}
    >

      {open
        ? <ChevronDown size={13} />
        : <ChevronRight size={13} />
      }

      {React.cloneElement(
        icon,
        {
          size: 15
        }
      )}

      <span>
        {label}
      </span>

    </button>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [classes, setClasses] =
    useState(initialClasses);


  const [nodes, setNodes, onNodesChange] =
    useNodesState(
      initialClasses.map(cls => ({

        id: cls.id,

        type: "uml",

        position: cls.position,

        data: {
          name: cls.name,
          stereotype: cls.stereotype,
          attributes: cls.attributes,
          methods: cls.methods
        }

      }))
    );


  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);


  const [selectedId, setSelectedId] =
    useState("user");


  const [activeTab, setActiveTab] =
    useState("diagram");


  const [selectedFile, setSelectedFile] =
    useState("User.java");


  const [copied, setCopied] =
    useState(false);


  const [treeOpen, setTreeOpen] =
    useState({
      root: true,
      src: true,
      main: true,
      java: true,
      package: true
    });


  /* =====================================================
     GENERATED JAVA FILES
  ===================================================== */

  const generatedFiles = useMemo(
    () =>
      buildGeneratedFiles(
        classes,
        edges
      ),
    [
      classes,
      edges
    ]
  );


  useEffect(() => {

    if (
      !generatedFiles.some(
        file =>
          file.name === selectedFile
      )
    ) {

      setSelectedFile(
        generatedFiles[0]?.name || ""
      );

    }

  }, [
    generatedFiles,
    selectedFile
  ]);


  const selectedClass =
    classes.find(
      cls =>
        cls.id === selectedId
    );


  const selectedGeneratedFile =
    generatedFiles.find(
      file =>
        file.name === selectedFile
    ) ||
    generatedFiles[0];


  /* =====================================================
     SYNC UML NODES
  ===================================================== */

  const syncNodes = useCallback(
    nextClasses => {

      setNodes(

        nextClasses.map(cls => ({

          id: cls.id,

          type: "uml",

          position:
            cls.position ||
            {
              x: 100,
              y: 100
            },

          data: {
            name: cls.name,
            stereotype: cls.stereotype,
            attributes: cls.attributes,
            methods: cls.methods
          }

        }))

      );

    },
    [setNodes]
  );


  /* =====================================================
     UPDATE CLASS
  ===================================================== */

  const updateClass = patch => {

    const next =
      classes.map(cls =>

        cls.id === selectedId
          ? {
              ...cls,
              ...patch
            }
          : cls

      );


    setClasses(next);

    syncNodes(next);
  };


  /* =====================================================
     ADD CLASS
  ===================================================== */

  const addClass = () => {

    const id =
      `class-${Date.now()}`;


    const newClass = {

      id,

      name: "NewClass",

      stereotype: "class",

      attributes: [
        {
          visibility: "private",
          name: "id",
          type: "int"
        }
      ],

      methods: [
        {
          visibility: "public",
          name: "doSomething",
          returnType: "void",
          params: ""
        }
      ],

      position: {
        x:
          150 +
          classes.length * 50,

        y:
          100 +
          classes.length * 50
      }

    };


    const next =
      [
        ...classes,
        newClass
      ];


    setClasses(next);

    syncNodes(next);

    setSelectedId(id);

    setActiveTab("diagram");
  };


  /* =====================================================
     DELETE CLASS
  ===================================================== */

  const deleteSelected = () => {

    if (!selectedId) return;


    const next =
      classes.filter(
        cls =>
          cls.id !== selectedId
      );


    setClasses(next);

    syncNodes(next);


    setEdges(
      currentEdges =>
        currentEdges.filter(
          edge =>
            edge.source !== selectedId &&
            edge.target !== selectedId
        )
    );


    setSelectedId(
      next[0]?.id || null
    );
  };


  /* =====================================================
     ATTRIBUTES
  ===================================================== */

  const addAttribute = () => {

    if (!selectedClass) return;


    updateClass({

      attributes: [

        ...selectedClass.attributes,

        {
          visibility: "private",
          name: "field",
          type: "String"
        }

      ]

    });

  };


  const updateAttribute = (
    index,
    patch
  ) => {

    if (!selectedClass) return;


    updateClass({

      attributes:
        selectedClass.attributes.map(
          (attribute, i) =>
            i === index
              ? {
                  ...attribute,
                  ...patch
                }
              : attribute
        )

    });

  };


  const removeAttribute = index => {

    if (!selectedClass) return;


    updateClass({

      attributes:
        selectedClass.attributes.filter(
          (_, i) =>
            i !== index
        )

    });

  };


  /* =====================================================
     METHODS
  ===================================================== */

  const addMethod = () => {

    if (!selectedClass) return;


    updateClass({

      methods: [

        ...selectedClass.methods,

        {
          visibility: "public",
          name: "method",
          returnType: "void",
          params: ""
        }

      ]

    });

  };


  const updateMethod = (
    index,
    patch
  ) => {

    if (!selectedClass) return;


    updateClass({

      methods:
        selectedClass.methods.map(
          (method, i) =>
            i === index
              ? {
                  ...method,
                  ...patch
                }
              : method
        )

    });

  };


  const removeMethod = index => {

    if (!selectedClass) return;


    updateClass({

      methods:
        selectedClass.methods.filter(
          (_, i) =>
            i !== index
        )

    });

  };


  /* =====================================================
     CONNECT UML CLASSES
  ===================================================== */

  const onConnect = useCallback(
    connection => {

      setEdges(
        currentEdges =>

          addEdge(
            {
              ...connection,

              type: "smoothstep",

              markerEnd: {
                type:
                  MarkerType.ArrowClosed
              }
            },

            currentEdges
          )

      );

    },
    [setEdges]
  );


  /* =====================================================
     DRAG CLASS
  ===================================================== */

  const onNodeDragStop =
    useCallback(
      (_, node) => {

        const next =
          classes.map(cls =>

            cls.id === node.id
              ? {
                  ...cls,
                  position:
                    node.position
                }
              : cls

          );


        setClasses(next);

      },
      [classes]
    );


  /* =====================================================
     COPY JAVA FILE
  ===================================================== */

  const copyCode = async () => {

    if (!selectedGeneratedFile)
      return;


    await navigator.clipboard.writeText(
      selectedGeneratedFile.content
    );


    setCopied(true);


    setTimeout(
      () => setCopied(false),
      1200
    );

  };


  /* =====================================================
     EXPORT COMPLETE JAVA PROJECT
  ===================================================== */

  const downloadProject = async () => {

    const zip = new JSZip();


    /*
      Add every Java class as its own file.
    */

    generatedFiles.forEach(file => {

      zip.file(
        file.path,
        file.content
      );

    });


    /*
      Add README.
    */

    zip.file(
      "README.md",

`# UML Generated Java Project

Generated from the UML Class Diagram Generator.

Package:
${PACKAGE_NAME}

Java source files:

src/main/java/${PACKAGE_NAME.replace(/\./g, "/")}/

Each UML class is generated as a separate Java source file.
`
    );


    /*
      Generate ZIP.
    */

    const blob =
      await zip.generateAsync({
        type: "blob"
      });


    const url =
      URL.createObjectURL(blob);


    const anchor =
      document.createElement("a");


    anchor.href = url;

    anchor.download =
      "uml-generated-project.zip";


    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();


    URL.revokeObjectURL(url);
  };


  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {

    setClasses(
      initialClasses
    );

    setEdges(
      initialEdges
    );

    syncNodes(
      initialClasses
    );

    setSelectedId("user");

    setSelectedFile(
      "User.java"
    );

    setActiveTab(
      "diagram"
    );

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="app">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <Braces size={18} />
          </div>

          <div>

            <div className="brand-title">
              UML Class Diagram Generator
            </div>

            <div className="brand-subtitle">
              Design architecture → Generate Java project
            </div>

          </div>

        </div>


        <div className="top-actions">

          <button
            className="ghost-btn"
            onClick={reset}
          >
            <RotateCcw size={15} />
            Reset
          </button>


          <button
            className="primary-btn"
            onClick={downloadProject}
          >
            <Download size={15} />
            Export Project ZIP
          </button>

        </div>

      </header>


      {/* =================================================
          WORKSPACE
      ================================================= */}

      <div className="workspace">


        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <aside className="left-panel">

          <div className="panel-heading">

            <span>
              Classes
            </span>

            <button
              className="icon-btn"
              onClick={addClass}
              title="Add class"
            >
              <Plus size={16} />
            </button>

          </div>


          <div className="class-list">

            {classes.map(cls => (

              <button
                key={cls.id}

                className={
                  `class-item ${
                    selectedId === cls.id
                      ? "active"
                      : ""
                  }`
                }

                onClick={() =>
                  setSelectedId(
                    cls.id
                  )
                }
              >

                <Box size={15} />

                <span>
                  {cls.name}
                </span>

              </button>

            ))}

          </div>


          <div className="left-footer">

            <div className="stat">
              <Box size={14} />
              {classes.length} classes
            </div>

            <div className="stat">
              <Braces size={14} />
              {generatedFiles.length} Java files
            </div>

          </div>

        </aside>


        {/* =================================================
            MAIN PANEL
        ================================================= */}

        <main className="main-panel">


          {/* TABS */}

          <div className="tabs">

            <button
              className={
                activeTab === "diagram"
                  ? "tab active"
                  : "tab"
              }

              onClick={() =>
                setActiveTab("diagram")
              }
            >
              <Box size={15} />
              Diagram
            </button>


            <button
              className={
                activeTab === "code"
                  ? "tab active"
                  : "tab"
              }

              onClick={() =>
                setActiveTab("code")
              }
            >
              <Code2 size={15} />
              Java Project
            </button>

          </div>


          {/* =================================================
              DIAGRAM
          ================================================= */}

          {activeTab === "diagram" ? (

            <div className="diagram-area">

              <ReactFlow

                nodes={
                  nodes.map(node => ({
                    ...node,

                    selected:
                      node.id ===
                      selectedId
                  }))
                }

                edges={edges}

                nodeTypes={nodeTypes}

                onNodesChange={
                  onNodesChange
                }

                onEdgesChange={
                  onEdgesChange
                }

                onConnect={
                  onConnect
                }

                onNodeClick={
                  (_, node) =>
                    setSelectedId(
                      node.id
                    )
                }

                onNodeDragStop={
                  onNodeDragStop
                }

                fitView
              >

                <Background gap={20} />

                <Controls />

                <MiniMap />

              </ReactFlow>

            </div>

          ) : (


            /* =================================================
               JAVA PROJECT EXPLORER
            ================================================= */

            <div className="code-workspace">


              {/* FILE EXPLORER */}

              <div className="explorer">

                <div className="explorer-header">

                  <span>
                    EXPLORER
                  </span>

                  <Search size={14} />

                </div>


                {/* ROOT */}

                <TreeRow

                  icon={
                    treeOpen.root
                      ? <FolderOpen />
                      : <Folder />
                  }

                  label="uml-generated-project"

                  open={
                    treeOpen.root
                  }

                  onClick={() =>
                    setTreeOpen(
                      state => ({
                        ...state,
                        root:
                          !state.root
                      })
                    )
                  }

                  level={0}

                />


                {treeOpen.root && (

                  <>


                    {/* SRC */}

                    <TreeRow

                      icon={
                        treeOpen.src
                          ? <FolderOpen />
                          : <Folder />
                      }

                      label="src"

                      open={
                        treeOpen.src
                      }

                      onClick={() =>
                        setTreeOpen(
                          state => ({
                            ...state,
                            src:
                              !state.src
                          })
                        )
                      }

                      level={1}

                    />


                    {treeOpen.src && (

                      <>


                        {/* MAIN */}

                        <TreeRow

                          icon={
                            treeOpen.main
                              ? <FolderOpen />
                              : <Folder />
                          }

                          label="main"

                          open={
                            treeOpen.main
                          }

                          onClick={() =>
                            setTreeOpen(
                              state => ({
                                ...state,
                                main:
                                  !state.main
                              })
                            )
                          }

                          level={2}

                        />


                        {treeOpen.main && (

                          <>


                            {/* JAVA */}

                            <TreeRow

                              icon={
                                treeOpen.java
                                  ? <FolderOpen />
                                  : <Folder />
                              }

                              label="java"

                              open={
                                treeOpen.java
                              }

                              onClick={() =>
                                setTreeOpen(
                                  state => ({
                                    ...state,
                                    java:
                                      !state.java
                                  })
                                )
                              }

                              level={3}

                            />


                            {treeOpen.java && (

                              <>


                                {/* PACKAGE */}

                                <TreeRow

                                  icon={
                                    treeOpen.package
                                      ? <FolderOpen />
                                      : <Folder />
                                  }

                                  label={
                                    PACKAGE_NAME
                                  }

                                  open={
                                    treeOpen.package
                                  }

                                  onClick={() =>
                                    setTreeOpen(
                                      state => ({
                                        ...state,
                                        package:
                                          !state.package
                                      })
                                    )
                                  }

                                  level={4}

                                />


                                {/* JAVA FILES */}

                                {treeOpen.package &&

                                  generatedFiles.map(
                                    file => (

                                      <button

                                        key={
                                          file.name
                                        }

                                        className={
                                          `file-row ${
                                            selectedFile ===
                                            file.name
                                              ? "selected"
                                              : ""
                                          }`
                                        }

                                        style={{
                                          paddingLeft: 118
                                        }}

                                        onClick={() =>
                                          setSelectedFile(
                                            file.name
                                          )
                                        }

                                      >

                                        <FileCode2
                                          size={14}
                                        />

                                        {file.name}

                                      </button>

                                    )
                                  )
                                }

                              </>

                            )}

                          </>

                        )}

                      </>

                    )}

                  </>

                )}


                {/* README */}

                <div
                  className="file-row readme"
                  style={{
                    paddingLeft: 32
                  }}
                >

                  <FileCode2
                    size={14}
                  />

                  README.md

                </div>

              </div>


              {/* CODE EDITOR */}

              <div className="editor">

                <div className="editor-tabbar">

                  <div className="editor-file">

                    <FileCode2
                      size={15}
                    />

                    {selectedGeneratedFile
                      ?.name ||
                      "No file"}

                  </div>


                  <button
                    className="copy-btn"
                    onClick={copyCode}
                    disabled={
                      !selectedGeneratedFile
                    }
                  >

                    {copied
                      ? <Check size={14} />
                      : <Copy size={14} />
                    }

                    {copied
                      ? "Copied"
                      : "Copy"
                    }

                  </button>

                </div>


                <div className="code-content">

                  {selectedGeneratedFile ? (

                    <pre>
                      <code>
                        {
                          selectedGeneratedFile.content
                        }
                      </code>
                    </pre>

                  ) : (

                    <div className="empty-code">

                      Add a class to generate
                      a Java file.

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}

        </main>


        {/* =================================================
            RIGHT PROPERTIES
        ================================================= */}

        <aside className="right-panel">

          <div className="panel-heading">

            <span>
              Properties
            </span>


            {selectedClass && (

              <button
                className="danger-icon"
                onClick={
                  deleteSelected
                }

                title="Delete class"
              >

                <Trash2 size={15} />

              </button>

            )}

          </div>


          {selectedClass ? (

            <div className="properties">


              {/* CLASS NAME */}

              <label>
                Class name
              </label>

              <input

                value={
                  selectedClass.name
                }

                onChange={e =>
                  updateClass({
                    name:
                      e.target.value
                  })
                }

              />


              {/* STEREOTYPE */}

              <label>
                Stereotype
              </label>

              <select

                value={
                  selectedClass.stereotype
                }

                onChange={e =>
                  updateClass({
                    stereotype:
                      e.target.value
                  })
                }

              >

                <option value="class">
                  class
                </option>

                <option value="interface">
                  interface
                </option>

                <option value="abstract">
                  abstract
                </option>

                <option value="entity">
                  entity
                </option>

                <option value="service">
                  service
                </option>

              </select>


              {/* ATTRIBUTES */}

              <div className="section-title">

                <span>
                  Attributes
                </span>

                <button
                  className="mini-add"
                  onClick={
                    addAttribute
                  }
                >

                  <Plus size={14} />

                </button>

              </div>


              {selectedClass.attributes.map(
                (attribute, index) => (

                  <div
                    className="editor-row"
                    key={index}
                  >

                    <select

                      value={
                        attribute.visibility
                      }

                      onChange={e =>
                        updateAttribute(
                          index,
                          {
                            visibility:
                              e.target.value
                          }
                        )
                      }

                    >

                      <option value="private">
                        -
                      </option>

                      <option value="protected">
                        #
                      </option>

                      <option value="public">
                        +
                      </option>

                    </select>


                    <input

                      value={
                        attribute.name
                      }

                      onChange={e =>
                        updateAttribute(
                          index,
                          {
                            name:
                              e.target.value
                          }
                        )
                      }

                      placeholder="name"

                    />


                    <input

                      value={
                        attribute.type
                      }

                      onChange={e =>
                        updateAttribute(
                          index,
                          {
                            type:
                              e.target.value
                          }
                        )
                      }

                      placeholder="type"

                    />


                    <button

                      className="row-delete"

                      onClick={() =>
                        removeAttribute(
                          index
                        )
                      }

                    >

                      <Minus
                        size={13}
                      />

                    </button>

                  </div>

                )
              )}


              {/* METHODS */}

              <div className="section-title">

                <span>
                  Methods
                </span>

                <button
                  className="mini-add"
                  onClick={
                    addMethod
                  }
                >

                  <Plus size={14} />

                </button>

              </div>


              {selectedClass.methods.map(
                (method, index) => (

                  <div
                    className="method-card"
                    key={index}
                  >

                    <div className="editor-row">

                      <select

                        value={
                          method.visibility
                        }

                        onChange={e =>
                          updateMethod(
                            index,
                            {
                              visibility:
                                e.target.value
                            }
                          )
                        }

                      >

                        <option value="private">
                          -
                        </option>

                        <option value="protected">
                          #
                        </option>

                        <option value="public">
                          +
                        </option>

                      </select>


                      <input

                        value={
                          method.name
                        }

                        onChange={e =>
                          updateMethod(
                            index,
                            {
                              name:
                                e.target.value
                            }
                          )
                        }

                        placeholder="method"

                      />


                      <div />


                      <button

                        className="row-delete"

                        onClick={() =>
                          removeMethod(
                            index
                          )
                        }

                      >

                        <Minus
                          size={13}
                        />

                      </button>

                    </div>


                    <div className="method-subrow">

                      <input

                        value={
                          method.returnType
                        }

                        onChange={e =>
                          updateMethod(
                            index,
                            {
                              returnType:
                                e.target.value
                            }
                          )
                        }

                        placeholder="return type"

                      />


                      <input

                        value={
                          method.params
                        }

                        onChange={e =>
                          updateMethod(
                            index,
                            {
                              params:
                                e.target.value
                            }
                          )
                        }

                        placeholder={
                          "String name, int id"
                        }

                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-properties">

              Select a class to edit
              its properties.

            </div>

          )}

        </aside>

      </div>

    </div>
  );
}


createRoot(
  document.getElementById("root")
).render(
  <App />
);