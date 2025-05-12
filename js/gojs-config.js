function start_diagram(diagram) {
  if (!diagram) return;

  myDiagram = new go.Diagram(diagram, {
    allowCopy: false,
    allowDelete: false,
    initialAutoScale: go.AutoScale.UniformToFill,
    maxSelectionCount: 1, // users can select only one part at a time
    layout: new go.TreeLayout({
      treeStyle: go.TreeStyle.LastParents,
      arrangement: go.TreeArrangement.Horizontal,
      // properties for most of the tree:
      angle: 90,
      layerSpacing: 35,
      // properties for the "last parents":
      alternateAngle: 90,
      alternateLayerSpacing: 35,
      alternateAlignment: go.TreeAlignment.Bus,
      alternateNodeSpacing: 20,
    }),
    "themeManager.changesDivBackground": true,
    "themeManager.currentTheme": "light",
  });

  // set up some colors/fonts for the default ('light') and dark Themes
  myDiagram.themeManager.set("light", {
    colors: {
      background: "#fff",
      text: "#111827",
      textHighlight: "#11a8cd",
      subtext: "#6b7280",
      badge: "#f0fdf4",
      badgeBorder: "#16a34a33",
      badgeText: "#15803d",
      divider: "#6b7280",
      shadow: "#9ca3af",
      tooltip: "#1f2937",
      levels: [
        "#AC193D",
        "#2672EC",
        "#8C0095",
        "#5133AB",
        "#008299",
        "#D24726",
        "#008A00",
        "#094AB2",
      ],
      dragOver: "#f0f9ff",
      link: "#9ca3af",
      div: "#f3f4f6",
    },
    fonts: {
      name: "500 0.875rem InterVariable, sans-serif",
      normal: "0.875rem InterVariable, sans-serif",
      badge: "500 0.75rem InterVariable, sans-serif",
      link: "600 0.875rem InterVariable, sans-serif",
    },
  });

  myDiagram.themeManager.set("dark", {
    colors: {
      background: "#111827",
      text: "#fff",
      subtext: "#d1d5db",
      badge: "#22c55e19",
      badgeBorder: "#22c55e21",
      badgeText: "#4ade80",
      shadow: "#111827",
      dragOver: "#082f49",
      link: "#6b7280",
      div: "#1f2937",
    },
  });

  // Used to convert the node's tree level into a theme color
  function findLevelColor(node) {
    return node.findTreeLevel();
  }

  // Gets the text for a tooltip based on the adorned object's name
  function toolTipTextConverter(obj) {
    if (obj.name === "EMAIL") return obj.part.data.email;
    if (obj.name === "PHONE") return obj.part.data.telefone;
  }

  // Align the tooltip based on the adorned object's viewport bounds
  function toolTipAlignConverter(obj, tt) {
    const d = obj.diagram;
    const bot = obj.getDocumentPoint(go.Spot.Bottom);
    const viewPt = d.transformDocToView(bot).offset(0, 35);
    // if tooltip would be below viewport, show above instead
    const align =
      d.viewportBounds.height >= viewPt.y / d.scale
        ? new go.Spot(0.5, 1, 0, 6)
        : new go.Spot(0.5, 0, 0, -6);

    tt.alignment = align;
    tt.alignmentFocus = align.y === 1 ? go.Spot.Top : go.Spot.Bottom;
  }

  // a tooltip for the Email and Phone buttons
  const toolTip = new go.Adornment(go.Panel.Spot, {
    isShadowed: true,
    shadowOffset: new go.Point(0, 2),
  })
    .add(
      new go.Placeholder(),
      new go.Panel(go.Panel.Auto)
        .add(
          new go.Shape("RoundedRectangle", {
            strokeWidth: 0,
            shadowVisible: true,
          }).theme("fill", "background"),
          new go.TextBlock({ margin: 2 })
            .bindObject("text", "adornedObject", toolTipTextConverter)
            .theme("stroke", "text")
            .theme("font", "normal")
        )
        // sets alignment and alignmentFocus based on adorned object's position in viewport
        .bindObject("", "adornedObject", toolTipAlignConverter)
    )
    .theme("shadowColor", "shadow");

  // define the Node template
  myDiagram.nodeTemplate = new go.Node(go.Panel.Spot, {
    isShadowed: true,
    shadowOffset: new go.Point(0, 2),
    selectionObjectName: "BODY",
    // show/hide buttons when mouse enters/leaves
    mouseEnter: (e, node) => (node.findObject("BUTTONX").opacity = 1),
    mouseLeave: (e, node) => {
      if (node.isSelected) return;
      node.findObject("BUTTONX").opacity = 0;
    },
  })
    .add(
      new go.Panel(go.Panel.Auto, { name: "BODY" }).add(
        // define the node's outer shape
        new go.Shape("RoundedRectangle", {
          name: "SHAPE",
          strokeWidth: 0,
          portId: "",
          spot1: go.Spot.TopLeft,
          spot2: go.Spot.BottomRight,
        }).theme("fill", "background"),
        new go.Panel(go.Panel.Table, {
          margin: 0.5,
          defaultRowSeparatorStrokeWidth: 0.5,
        })
          .theme("defaultRowSeparatorStroke", "divider")
          .add(
            new go.Panel(go.Panel.Table, {
              padding: new go.Margin(12, 18, 18, 24),
            })
              .addColumnDefinition(0, {
                width: 360,
              })
              .add(
                new go.Panel(go.Panel.Table, {
                  column: 0,
                  alignment: go.Spot.Left,
                  stretch: go.Stretch.Vertical,
                  defaultAlignment: go.Spot.Left,
                }).add(
                  new go.Panel(go.Panel.Horizontal, {
                    row: 0,
                  }).add(
                    new go.TextBlock({
                      editable: false,
                      minSize: new go.Size(10, 14),
                    })
                      .bindTwoWay("text", "colaborador")
                      .theme("stroke", "text")
                      .theme("font", "name"),
                    new go.Panel(go.Panel.Auto, {
                      margin: new go.Margin(0, 0, 0, 10),
                    }).add(
                      new go.Shape("Capsule", { parameter1: 6, parameter2: 6 })
                        .theme("fill", "badge")
                        .theme("stroke", "badgeBorder"),
                      new go.TextBlock({
                        editable: false,
                        minSize: new go.Size(22, 8),
                        margin: new go.Margin(2, 0),
                      })
                        .bindTwoWay("text", "competencia")
                        .theme("stroke", "badgeText")
                        .theme("font", "badge")
                    )
                  ),
                  new go.TextBlock({
                    row: 1,
                    editable: false,
                    minSize: new go.Size(10, 14),
                  })
                    .bindTwoWay("text", "cargo")
                    .theme("stroke", "subtext")
                    .theme("font", "normal")
                )
              ),
            new go.Panel(go.Panel.Table, {
              row: 1,
              stretch: go.Stretch.Horizontal,
              defaultColumnSeparatorStrokeWidth: 0.5,
            })
              .theme("defaultColumnSeparatorStroke", "divider")
              .add(makeBottomButton("EMAIL"), makeBottomButton("PHONE"))
          )
      ), // end Auto Panel
      new go.Shape("RoundedLeftRectangle", {
        alignment: go.Spot.Left,
        alignmentFocus: go.Spot.Left,
        stretch: go.Stretch.Vertical,
        width: 6,
        strokeWidth: 0,
      }).themeObject("fill", "", "levels", findLevelColor),
      go.GraphObject.build("TreeExpanderButton", {
        _treeExpandedFigure: "LineUp",
        _treeCollapsedFigure: "LineDown",
        name: "BUTTONX",
        alignment: go.Spot.Bottom,
        opacity: 0, // initially not visible
      }).bindObject("opacity", "isSelected", (s) => (s ? 1 : 0))
    )
    .theme("shadowColor", "shadow")
    // for sorting, have the Node.text be the data.name
    .bind("text", "name")
    // bind the Part.layerName to control the Node's layer depending on whether it isSelected
    .bindObject("layerName", "isSelected", (sel) => (sel ? "Foreground" : ""))
    .bindTwoWay("isTreeExpanded");

  function makeBottomButton(name) {
    const phonePath =
      "F M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z";
    const emailPath =
      "F M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3zM19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z";
    const convertSelectedToThemeProp = (s) => (s ? "textHighlight" : "text");
    const isEmail = name === "EMAIL";
    return new go.Panel(go.Panel.Table, {
      mouseEnter: (e, obj) => myDiagram.model.set(obj.part.data, name, true),
      mouseLeave: (e, obj) => myDiagram.model.set(obj.part.data, name, false),
      name,
      background: "transparent",
      cursor: "Pointer",
      column: isEmail ? 0 : 1,
      width: 140,
      height: 40,
      toolTip: toolTip,
      click: (e, obj) => {
        console.log(name.toLowerCase());
        console.log(obj.part.data[name.toLowerCase()]);
        // dialog.firstElementChild.firstElementChild.innerHTML =
        //     // the modal's span
        //     `You clicked to ${isEmail ? 'send email to' : 'call'} ${obj.part.data.name} at ${obj.part.data[name.toLowerCase()]}`;
        // dialog.showModal();
      },
    }).add(
      new go.Panel(go.Panel.Horizontal).add(
        new go.Shape({
          geometryString: isEmail ? emailPath : phonePath,
          strokeWidth: 0,
          desiredSize: isEmail ? new go.Size(20, 16) : new go.Size(20, 20),
          margin: new go.Margin(0, 12, 0, 0),
        })
          .theme("fill", "text")
          .themeData("fill", name, null, convertSelectedToThemeProp),
        new go.TextBlock(isEmail ? "Email" : "Telefone")
          .theme("stroke", "text")
          .themeData("stroke", name, null, convertSelectedToThemeProp)
          .theme("font", "link")
      )
    );
  }

  // define the Link template
  myDiagram.linkTemplate = new go.Link({
    routing: go.Routing.Orthogonal,
    layerName: "Background",
    corner: 5,
  }).add(new go.Shape({ strokeWidth: 2 }).theme("stroke", "link")); // the link shape
}

function load_diagram(dados) {
  myDiagram.model = go.Model.fromJson({
    class: "go.TreeModel",
    nodeDataArray: dados,
  });

  // make sure new data keys are unique positive integers
  let lastkey = 1;
  myDiagram.model.makeUniqueKeyFunction = (model, data) => {
    let k = data.key || lastkey;
    while (model.findNodeDataForKey(k)) k++;
    data.key = lastkey = k;
    return k;
  };

  /////////////////
  /// Buttons
  if (document.getElementById("zoomIn")) {
    document.getElementById("zoomIn").addEventListener("click", () => {
      myDiagram.scale *= 1.1;
    });
  }

  if (document.getElementById("zoomOut")) {
    document.getElementById("zoomOut").addEventListener("click", () => {
      myDiagram.scale *= 0.9;
    });
  }

  // Setup zoom to fit button
  if (document.getElementById("zoomToFit")) {
    document
      .getElementById("zoomToFit")
      .addEventListener("click", () => myDiagram.commandHandler.zoomToFit());
  }

  if (document.getElementById("centerRoot")) {
    document.getElementById("centerRoot").addEventListener("click", () => {
      myDiagram.scale = 1;
      myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(1));
    });
  }

  if (document.getElementById("expand")) {
    document.getElementById("expand").addEventListener("click", () => {
      //myDiagram.commandHandler.expandTree();
      myDiagram.startTransaction("expandAll");
      myDiagram.nodes.each(function (node) {
        if (!node.findTreeParentNode()) {
          // if it's a root node
          node.expandTree();
        }
      });
      myDiagram.commitTransaction("expandAll");
    });
  }

  if (document.getElementById("collapse")) {
    document.getElementById("collapse").addEventListener("click", () => {
      // myDiagram.commandHandler.collapseTree();
      myDiagram.startTransaction("collapseAll");
      myDiagram.nodes.each(function (node) {
        if (!node.findTreeParentNode()) {
          // if it's a root node
          node.collapseTree();
        }
      });
      myDiagram.commitTransaction("collapseAll");
    });
  }
}
