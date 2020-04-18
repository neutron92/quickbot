import 'fabric';
//import $ from 'jquery';
//import 'jquery-mousewheel';
import {
    Streamy
} from 'meteor/yuukan:streamy';
import {
    initAligningGuidelines
} from './aligning_guidelines.js';

import {
    Bert
} from 'meteor/themeteorchef:bert';
import { Session } from 'meteor/session'
import { CreateIntentAddSVG } from '../api/intents/methods.js';

import { CreateAnswerAddSVG } from '../api/answers/methods.js';

import { insertHistory } from '../api/histories/methods.js';
Meteor.subscribe('users');
Meteor.subscribe('bots');
Meteor.subscribe('answers');
Meteor.subscribe('intents');
Meteor.subscribe('sentences');
Meteor.subscribe('messages');
Meteor.subscribe('chats');
Meteor.subscribe('histories');
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 3
});

const THEME = {
    connectorLabelBackground: '#fff',
    connectorLabelColor: '#666',
    connectorColor: '#333',
    connectorWidth: 4,
    connectorCirleBackground: '#fff',
    selectedConnectorColor: '#ff1e1e',
    graphicTitleColor: '#fff',
}

var canvas_state = new Array(),
    current_state = 0;
export const FabricAPI = function(mainCanvas, botid, permission) {

    var canvas = new fabric.Canvas(mainCanvas, {
        backgroundColor: '#fff',
        preserveObjectStacking: true,
        perPixelTargetFind: true,
        selection: false
    });
    if (permission === "readonly") {
        canvas.deactivateAll();
        canvas.renderAll();
    }
    console.log("canvas", canvas);
    var self = this;
    var viewportLeft = 0,
        lastObjectId, viewportTop = 0,
        mouseLeft, mouseTop, _drawSelection = canvas._drawSelection,
        isDown = false,
        inConnectingMode = false,
        connectingState = "ended",
        isStroked = false,
        tempLine, _previousLine, canvasMoveMode = false,
        connectingStartMode = false,
        connectingStartID, allStartLines, modifiedCheck = true,
        modifiedType = "",
        prevObject, isGroupMoved = false,
        isObjectMoving = false;
    var customeProperties = ['_objects', 'src', 'id', "strokeWidth", 'class', "stroke", 'index', 'alignment', 'line', 'lineType', 'connectors', 'circle', 'arrow', 'start', 'end', 'lineDifference', 'lineID', 'clabel'];
    var lastpoint, lastobject;
    var click = false;
    //  canvas.selection = false;

    canvas.on('mouse:over', function(options) {
        if (permission !== "readonly") {


            if (canvas.getObjects().length > 1) {
                var object = options.target;
                if (object) {
                    var point = canvas.getPointer(options.e);

                    var left = Math.abs(object.left - point.x);
                    var top = Math.abs(object.top - point.y);
                    if (((left >= 141) && (left <= 147)) && ((top >= 18) && (top <= 24))) {

                        for (var i = 0; i < object.paths.length; i++) {
                            //  console.log("group.paths[i]group.paths[i]", object.paths[i]);
                            if (object.paths[i].id == "output") {
                                /*group.set({
                                    id: group.paths[i].text
                                })*/
                                //    console.log("output");
                                object.paths[i].set({
                                    stroke: "pink",
                                });
                                canvas.renderAll();
                            }

                        }
                    }

                    if (((left >= 3) && (left <= 9)) && ((top >= 18) && (top <= 24))) {

                        for (var i = 0; i < object.paths.length; i++) {
                            //    console.log("group.paths[i]group.paths[i]", object.paths[i]);
                            if (object.paths[i].id == "input") {
                                /*group.set({
                                    id: group.paths[i].text
                                })*/
                                // console.log("output");
                                object.paths[i].set({
                                    stroke: "pink",
                                });
                                canvas.renderAll();
                            }

                        }
                    }
                }
            }
        }
    });

    canvas.on('mouse:out', function(options) {
        if (permission !== "readonly") {
            var object = options.target;
            if (object && !object._objects) {
                if (!click) {
                    for (var i = 0; i < object.paths.length; i++) {
                        //    console.log("group.paths[i]group.paths[i]", object.paths[i]);
                        if (object.paths[i].id == "output" || object.paths[i].id == "input") {
                            /*group.set({
                                id: group.paths[i].text
                            })*/
                            //   console.log("output");
                            object.paths[i].set({
                                stroke: "#000",
                            });
                            canvas.renderAll();
                        }

                    }
                }
            }
        }
    });
    canvas.on('mouse:up', function(options) {
        if (permission !== "readonly") {
            var object = options.target;
            isDown = false;
            if (isObjectMoving === "moving") {
                if (object) {
                    insertHistory.call({
                        action: "moving",
                        botId: FlowRouter.getParam("id"),
                        userId: Meteor.userId(),
                        componentId: object.dbId
                    }, function(err) {
                        if (err) {
                            console.log("insertHistoryfabric", err);
                        } else {
                            isObjectMoving = "notmoving"
                        }
                    })
                }

            }

        }
    });

    canvas.on('mouse:down', function(options) {
        if (permission !== "readonly") {
            isDown = true;
            viewportLeft = canvas.viewportTransform[4];
            viewportTop = canvas.viewportTransform[5];
            mouseLeft = options.e.x;
            mouseTop = options.e.y;
            self.renderVieportBorders();
            contextMenu.hide();
            var object = options.target;
            console.log("objectobject", object);
            if (canvas.getObjects().length >= 1) {
                if (object) {
                    //  console.log("object", object);

                    var point = canvas.getPointer(options.e);

                    var left = Math.abs(object.left - point.x);
                    var top = Math.abs(object.top - point.y);
                    // console.log("left", left);
                    //  console.log("top", top);
                    if (!click /*((left >= 141) && (left <= 147)) && ((top >= 18) && (top <= 24))*/ ) {
                        console.log("clickclick", click);
                        click = true;
                        console.log("clickclick2", click);
                        //    self.startConnecting();
                        lastpoint = point;
                        lastobject = object;
                        console.log("this is the last object", object);
                        canvas.forEachObject(function(element) {
                            element.selectable = false;
                        });
                        canvas.renderAll();
                        canvas.freeDrawingCursor = 'default';

                        for (var i = 0; i < object.paths.length; i++) {
                            //  console.log("group.paths[i]group.paths[i]", object.paths[i]);
                            if (object.paths[i].id == "output") {
                                /*group.set({
                                    id: group.paths[i].text
                                })*/
                                //       console.log("output");
                                object.paths[i].set({
                                    stroke: "red",
                                });
                                canvas.renderAll();
                            }

                        }
                        var _id = 'line' + new Date().getTime();

                        tempLine = new fabric.Line([object.left + 144, object.top + 21, object.left + 144, object.top + 21], {
                            stroke: THEME.connectorColor,
                            strokeWidth: THEME.connectorWidth,
                            hasBorders: false,
                            hasControls: false,
                            selectable: false,
                            evented: false,
                            originX: 'center',
                            originY: 'center',
                            hasRotatingPoint: false,
                            class: 'connector',
                            id: _id,
                            // start: { id: object.id, obj: object },
                            //   end: { id: object.id, obj: object },
                        });
                        console.log("tempLine", tempLine);
                        canvas.add(tempLine);
                        canvas.renderAll();
                        connectingState = 'moving';
                    } else if ( /*((left > 147) || (left < 141)) && ((top < 18) || (top > 24))*/ click && connectingState == 'moving') {
                        console.log("clickclick3", click);
                        click = false;
                        console.log("clickclick4", click);
                        for (var i = 0; i < lastobject.paths.length; i++) {
                            if (lastobject.paths[i].id == "output" || lastobject.paths[i].id == "input") {

                                // console.log("output");
                                lastobject.paths[i].set({
                                    stroke: "#000",
                                });
                                canvas.renderAll();
                            }

                        }

                        canvas.forEachObject(function(element) {
                            element.selectable = true;
                        });
                        var exist = false;
                        $.each(lastobject.connectors, function(i, el) {
                            $.each(object.connectors, function(j, el2) {
                                if ((lastobject.connectors[i].type == "end") && (object.connectors[j].type == "start") && (object.connectors[j].id === lastobject.connectors[i].id)) {
                                    exist = true;
                                }
                                if ((lastobject.connectors[i].type == "start") && (object.connectors[j].type == "end") && (object.connectors[j].id === lastobject.connectors[i].id)) {
                                    exist = true;
                                }
                            });
                        });
                        console.log("objectobject", object.id, lastobject.id);
                        if (object.id !== lastobject.id) {

                            if (!exist) {
                                var valid = true;
                                if (lastobject.class != object.class) {
                                    if (lastobject.class === "bot") {
                                        if (lastobject.connectors.length > 0) {
                                            valid = true;
                                        } else {
                                            valid = false;
                                            if (connectingState == 'moving') {
                                                connectingState = 'ended';
                                                canvas.fxRemove(tempLine);
                                                canvas.renderAll();
                                            }
                                            Bert.alert({
                                                type: 'danger',
                                                style: 'growl-top-right',
                                                title: TAPi18n.__('error'),
                                                message: TAPi18n.__("botcantbe1"),
                                                icon: 'fa-times'
                                            });
                                        }

                                    }

                                    if (lastobject.class === "user") {
                                        if (lastobject.connectors.length > 0) {
                                            $.each(lastobject.connectors, function(i, el) {
                                                if (lastobject.connectors[i].type == "start") {
                                                    console.log(lastobject);
                                                    console.log(lastobject.connectors[i].obj);
                                                    if (lastobject.connectors[i].obj.end && lastobject.connectors[i].obj.end.class == "bot") {
                                                        //       console.log("lastobject.connectors[" + i + "]", lastobject.connectors[i]);
                                                        valid = false;
                                                        if (connectingState == 'moving') {
                                                            connectingState = 'ended';
                                                            canvas.fxRemove(tempLine);
                                                            canvas.renderAll();
                                                        }
                                                        Bert.alert({
                                                            type: 'danger',
                                                            style: 'growl-top-right',
                                                            title: TAPi18n.__('error'),
                                                            message: TAPi18n.__("cantbe2bots"),
                                                            icon: 'fa-times'
                                                        });
                                                    }
                                                }
                                            });

                                        } else {
                                            valid = true;
                                        }

                                    }
                                    if (valid) {

                                        tempLine.set({
                                            'x2': object.left + 6,
                                            'y2': object.top + 21
                                        }).setCoords();
                                        tempLine.set({
                                            start: { id: lastobject.id, obj: lastobject },
                                            end: { id: object.id, obj: object },
                                        });
                                        connectingState = 'ended';


                                        Streamy.emit('addNewlink', {
                                            data: { id: lastobject.dbId, svg: lastobject.id, class: lastobject.class, id2: object.dbId, svg2: object.id, class2: object.class }
                                        });

                                        Streamy.emit('savetodb', {
                                            data: JSON.stringify(self.exportJSON()),
                                            botid: botid
                                        });

                                        canvas.renderAll();
                                        object.connectors.push({
                                            id: tempLine.id,
                                            obj: tempLine,
                                            type: "end"
                                        });
                                        // object.connectedintput = true;
                                        lastobject.connectors.push({
                                            id: tempLine.id,
                                            obj: tempLine,
                                            type: "start"
                                        });
                                        //   lastobject.connectedOutput = true;
                                        console.log("lastobject,object", lastobject, object);
                                        //    lastobject = null;

                                        //canvas.add(tempLine);
                                        canvas.renderAll();
                                        // tempLine = null;
                                    }

                                } else {
                                    Bert.alert({
                                        type: 'danger',
                                        style: 'growl-top-right',
                                        title: TAPi18n.__('error'),
                                        message: TAPi18n.__("2simobject"),
                                        icon: 'fa-times'
                                    });
                                }


                            } else {
                                if (connectingState == 'moving') {
                                    connectingState = 'ended';
                                    canvas.fxRemove(tempLine);
                                    canvas.renderAll();
                                }
                            }
                        } else {
                            console.log("deletehere5");
                            canvas.freeDrawingCursor = 'move';
                            if (connectingState == 'moving') {
                                connectingState = 'ended';
                                canvas.fxRemove(tempLine);
                                canvas.renderAll();
                            }
                            Streamy.emit('intentModalServer', {
                                data: { id: object.id, class: object.class, dbId: object.dbId },
                            });

                            Streamy.on('ModalsubmitClient', function(d, s) {
                                object.done = true;
                                for (var i = 0; i < object.paths.length; i++) {
                                    if (object.paths[i].id == "title") {
                                        var text = d.data.name;
                                        if (text.length > 5) {
                                            text = text.substr(0, 5) + "...";
                                        }
                                        if (object.class === "bot") {
                                            object.paths[i].set({
                                                fill: "#ffffff",
                                                top: -15,
                                                left: 61,
                                                fontSize: 14,
                                                text: "bot: " + text
                                            });
                                        } else {
                                            object.paths[i].set({
                                                fill: "#ffffff",
                                                top: -15,
                                                left: 61,
                                                fontSize: 14,
                                                text: "intent: " + text
                                            });
                                        }

                                    }

                                }
                                canvas.renderAll();
                                Streamy.emit('savetodb', {
                                    data: JSON.stringify(self.exportJSON()),
                                    botid: botid
                                });
                            });
                            console.log("clickclick3", click);
                            click = false;
                            console.log("clickclick4", click);
                        }
                    } else {
                        console.log("deletehere4", click, connectingState);
                        canvas.freeDrawingCursor = 'move';
                        if (connectingState == 'moving') {
                            connectingState = 'ended';
                            canvas.fxRemove(tempLine);
                            canvas.renderAll();
                        }
                    }
                } else {
                    console.log("deletehere1");
                    if (connectingState == 'moving') {
                        connectingState = 'ended';
                        canvas.fxRemove(tempLine);
                        canvas.renderAll();
                    }
                }
            }
        }
    });

    canvas.on('mouse:move', function(options) {
        if (permission !== "readonly") {
            isObjectMoving = "moving";
            var pointer = canvas.getPointer(options.e);
            if (options.e.altKey && isDown) {
                var currentMouseLeft = options.e.x;
                var currentMouseTop = options.e.y;
                var deltaLeft = currentMouseLeft - mouseLeft,
                    deltaTop = currentMouseTop - mouseTop;
                canvas.viewportTransform[4] = viewportLeft + deltaLeft;
                canvas.viewportTransform[5] = viewportTop + deltaTop;
                canvas.renderAll();
                self.renderVieportBorders();
            }
            if (connectingState == 'moving') {
                tempLine.set({
                    'x2': pointer.x,
                    'y2': pointer.y
                }).setCoords();
                canvas.renderAll();
            }
            if (canvasMoveMode && isDown) {
                var currentMouseLeft = options.e.x;
                var currentMouseTop = options.e.y;
                if (typeof currentMouseLeft === "undefined") {
                    if (typeof options.e.touches !== "undefined") {
                        currentMouseLeft = options.e.touches[0].clientX;
                        currentMouseTop = options.e.touches[0].clientY;
                    } else {
                        currentMouseLeft = options.e.clientX;
                        currentMouseTop = options.e.clientY;
                    }
                }
                var deltaLeft = currentMouseLeft - mouseLeft,
                    deltaTop = currentMouseTop - mouseTop;
                canvas.viewportTransform[4] = viewportLeft + deltaLeft;
                canvas.viewportTransform[5] = viewportTop + deltaTop;
                canvas.renderAll();
                self.renderVieportBorders();
            }
        }
    });

    canvas.on('selection:created', function(options) {
        if (permission !== "readonly") {
            console.log("ev.target._objects", options.target);
            if (Array.isArray(options.target._objects)) {
                options.target.set({
                    lockScalingX: true,
                    lockScalingY: true,
                    // selectable: false,
                    hasControls: false,
                    hasRotatingPoint: false,
                });
                canvas.renderAll();
            }
        }
    });

    canvas.on('object:selected', function(options) {
        if (permission !== "readonly") {
            var object = options.target;
            console.log("selected", options);
        }
    });

    canvas.on('before:selection:cleared', function(options) {
        if (permission !== "readonly") {
            canvas.forEachObject(function(element) {
                element.selectable = true;
            });
        }
    });

    canvas.on('selection:cleared', function(options) {
        if (permission !== "readonly") {
            canvas.forEachObject(function(element) {
                element.selectable = true;
            });
        }
    });

    canvas.on('object:moving', function(options) {
        if (permission !== "readonly") {
            var object = options.target;


            if (object && !object._objects) {
                connectingState = 'ended';
                if (tempLine) {
                    canvas.fxRemove(tempLine);
                    canvas.renderAll();
                }

                click = false;
                console.log("object", object);
                var point = canvas.getPointer(options.e);
                //     console.log("object", object);
                //     console.log("point", point);

                if (object.connectors && object.connectors.length > 0) {
                    $.each(object.connectors, function(i, el) {
                        if (object.connectors[i].type == "start") {
                            // console.log("start");
                            canvas.forEachObject(function(obj) {
                                //  console.log("objobjobj", obj);
                                if ((obj.class == "connector") && (object.connectors[i].id == obj.id)) {
                                    console.log("start objobj", obj);
                                    obj.set({
                                        "x1": object.left + 144,
                                        "y1": object.top + 21,
                                        "x2": obj.end.obj.left + 6,
                                        "y2": obj.end.obj.top + 21,
                                        "start": { id: object.id, obj: object },
                                    });
                                    object.connectors[i].id = obj.id;
                                    object.connectors[i].obj = obj;
                                }
                            });
                        } else if (object.connectors[i].type == "end") {
                            //         console.log("end");
                            canvas.forEachObject(function(obj) {

                                if ((obj.class == "connector") && (object.connectors[i].id == obj.id)) {
                                    console.log("end objobj", obj);
                                    obj.set({
                                        "x1": obj.start.obj.left + 144,
                                        "y1": obj.start.obj.top + 21,
                                        "x2": object.left + 6,
                                        "y2": object.top + 21,
                                        "end": { id: object.id, obj: object },
                                    });
                                    object.connectors[i].id = obj.id;
                                    object.connectors[i].obj = obj;
                                }
                            });
                        }
                    });
                    canvas.renderAll();
                    Streamy.emit('savetodb', {
                        data: JSON.stringify(self.exportJSON()),
                        botid: botid
                    });
                }
            }

        }
    });

    canvas.on('object:modified', function(options) {
        console.log("editededited")
        if (permission !== "readonly") {
            Streamy.emit('savetodb', {
                data: JSON.stringify(self.exportJSON()),
                botid: botid
            });
        }
    });

    $(canvas.getElement().parentNode).on('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta > 0) {
            var newZoom = canvas.getZoom() + (1 / 40);
        } else {
            var newZoom = canvas.getZoom() - (1 / 40);
        }
        canvas.zoomToPoint({
            x: e.offsetX,
            y: e.offsetY
        }, newZoom);
        self.renderVieportBorders();
        contextMenu.hide();
        return false;
    });
    //canvas.selection = false;
    canvas.zoomToPoint({
        x: 0,
        y: 0
    }, 1);
    this.setObjectActive = function(o) {
        canvas.setActiveObject(o);
    };

    this.discardCanvas = function() {
        canvas.discardActiveObject();
        canvas.discardActiveGroup();
        canvas.fire('before:selection:cleared');
    };
    this.fireCanvasEvent = function(evt) {
        canvas.fire(evt);
    };
    this.setWidth = function(width) {
        canvas.setWidth(width);
    }

    this.setHeight = function(height) {
        canvas.setHeight(height);
    }
    this.addSvg = function(src) {



        fabric.loadSVGFromURL(src, function(objects, options) {

                options.connectors = new Array();
                options.id = 'svg' + new Date().getTime();
                var group = new fabric.PathGroup(objects, options);
                group.hasControls = false;
                group.hasRotatingPoint = false;
                group.done = false;


                for (var i = 0; i < group.paths.length; i++) {
                    if (group.paths[i].id == "title") {

                        group.paths[i].set({
                            fill: "#ffffff",
                            top: -14,
                            left: 61,
                            fontSize: 24
                        });
                        group.set({
                            class: group.paths[i].text.toLowerCase(),
                            top: 50,
                            left: 50,
                        });

                    }

                }
                if (group.class == "user") {
                    group.dbId = CreateIntentAddSVG.call({
                        botId: FlowRouter.getParam("id"),
                        svgId: options.id
                    }, function(err) {
                        if (err) {
                            console.log("CreateIntentAddSVG", err);
                        }
                    });
                } else {
                    group.dbId = CreateAnswerAddSVG.call({
                        botId: FlowRouter.getParam("id"),
                        svgId: options.id
                    }, function(err) {
                        if (err) {
                            console.log("CreateAnswerAddSVG", err);
                        }
                    });
                }
                var dbIdSVG = group.dbId;


                canvas.add(group).setActiveObject(group).calcOffset().renderAll();

                Streamy.emit('savetodb', {
                    data: JSON.stringify(self.exportJSON()),
                    botid: botid
                });
                insertHistory.call({
                    action: "creation",
                    botId: FlowRouter.getParam("id"),
                    userId: Meteor.userId(),
                    componentId: dbIdSVG
                }, function(err) {
                    if (err) {
                        console.log("insertHistoryfabric", err);
                    }
                })


            },
            function(item, object) {
                var dataMax = item.getAttribute('data-max');
                if (object.text) {
                    object.set('maxWords', dataMax ? dataMax : 16);
                }
            });


    };
    this.exportJSON = function() {
        self.alignIndex();
        return {
            json: canvas.toJSON(['src', 'id', 'class', 'connectors', 'start', 'end', 'done', 'dbId']),
            zoom: canvas.getZoom()
        };
    };
    this.findTargetAt = function(o) {
        var obj = canvas.findTarget(o);
        if (obj && obj.selectable) {
            return obj;
        }
        return false;
    };
    this.fireCanvasEvent = function(evt) {
        canvas.fire(evt);
    };
    this.alignIndex = function() {
        canvas.forEachObject(function(o) {
            if (o.class == 'svg') {
                o.index = canvas.getObjects().indexOf(o);
            }
        });
    };
    this.importJSON = function(j) {
        console.log("permission", permission);
        setTimeout(function() {
            console.log("timeout");
            $(".loading").hide();
        }, 50);
        if (permission === "readonly") {
            canvas.deactivateAll();
        }
        var x = JSON.parse(j);
        console.log("x", x.json);
        canvas.loadFromJSON(x.json, function(o, object) {
            console.log("o, object", o, object);
            canvas.forEachObject(function(obj) {
                console.log("objobj", obj);
                if (obj.class == "connector") {
                    obj.set({
                        hasBorders: false,
                        hasControls: false,
                        selectable: false,
                        evented: false,
                        hasRotatingPoint: false,
                    });
                } else {
                    obj.set({
                        hasControls: false,
                        hasRotatingPoint: false,
                        lockUniScaling: true,
                    });

                    for (var i = 0; i < obj.paths.length; i++) {
                        if (obj.paths[i].id == "title") {

                            obj.paths[i].set({
                                fill: "#ffffff",
                                top: -15,
                                left: 61,
                                // fontSize: 24
                            });

                            if (permission === "readonly") {
                                obj.paths[i].selectable = false;
                            }
                        }

                    }

                    if (permission === "readonly") {
                        obj.selectable = false;
                    }
                }
            });

            if (permission === "readonly") {
                canvas.deactivateAll();
                canvas.__eventListeners["mouse:down"] = [];
            }
            canvas.renderAll.bind(canvas);
            self.alignIndex();

            console.log("canvasinit", canvas);
            //setTimeout(self.makeConnectorsAlign, 1000);
        });
    };
    this.getCurrentObject = function() {
        return canvas.getActiveObject();
    }
    this.removeSVG = function() {
        console.log("canvas", canvas);
        var obj = canvas.getActiveObject();
        if (obj && (obj.class == 'user' || obj.class == 'bot')) {
            $.each(obj.connectors, function(index, val) {
                if (val) {
                    self.removeConnector(val.id);
                    self._removeAnotherEnd(val.id);
                    canvas.fire('before:selection:cleared');
                }
            });
            self.saveCanvas();
            canvas.fxRemove(obj).calcOffset().renderAll();
            canvas.renderAll();
            console.log("self.exportJSON()0", self.exportJSON());
        }
    };
    this.saveCanvas = function() {
        var exportJSON = self.exportJSON();
        var canvasObjects = canvas._objects;
        if (exportJSON.json.objects) {
            exportJSON.json.objects = canvasObjects;
        }
        /*Streamy.emit('savetodb', {
            data: JSON.stringify(exportJSON),
            botid: botid
        });*/
        console.log("self.exportJSON()2", canvas, exportJSON);
    };

    this._removeAnotherEnd = function(id) {
        canvas.forEachObject(function(obj) {
            if (obj.connectors) {
                $.each(obj.connectors, function(index, val) {
                    if (val && val.id == id) {
                        obj.connectors.splice(index, 1);
                    }
                });
            }
        });
    };
    this.removeConnector = function(id) {
        if (!id) return;
        canvas.forEachObject(function(obj) {
            if (obj.id == id && obj.class == "connector") {

                if (obj.clabel) {
                    canvas.fxRemove(obj.clabel);
                }
                canvas.fxRemove(obj);
                canvas.renderAll();
                // self.stopConnecting();

            }
        });
    };
    this.zoomIn = function() {
        var newZoom = canvas.getZoom() + 2 / 40;
        canvas.zoomToPoint({
            x: canvas.getCenter().top,
            y: canvas.getCenter().top
        }, newZoom);
        self.renderVieportBorders();
        canvas.renderAll();
    }
    this.zoomOut = function() {
        var newZoom = canvas.getZoom() - 2 / 40;
        canvas.zoomToPoint({
            x: canvas.getCenter().top,
            y: canvas.getCenter().top
        }, newZoom);
        self.renderVieportBorders();
        canvas.renderAll();
    }
    this.zoomReset = function() {
        var newZoom = 1;
        canvas.zoomToPoint({
            x: 0,
            y: 0
        }, newZoom);
        canvas.viewportTransform[4] = 0;
        canvas.viewportTransform[5] = 0;
        self.renderVieportBorders();
        canvas.renderAll();
    }

    this.startCanvasMove = function() {
        self.discardCanvas();
        canvasMoveMode = true;
        canvas.selection = false;
        canvas.forEachObject(function(element) {
            element.selectable = false;
        });
        canvas.defaultCursor = 'move';
        canvas.renderAll();
    };
    this.stopCanvasMove = function() {
        canvasMoveMode = false;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        canvas.forEachObject(function(element) {
            element.selectable = (element.class == 'connector' ? false : true);
            element.setCoords();
        });
        canvas.calcOffset();
        canvas.renderAll();
    };
    this.discardCanvas = function() {
        canvas.discardActiveObject();
        canvas.discardActiveGroup();
        canvas.fire('before:selection:cleared');
    };
    this.renderVieportBorders = function() {
        var ctx = canvas.getContext();
        ctx.save();
        ctx.restore();
    };
    this.verifyNodes = function() {
        for (var index = 0; index < canvas._objects.length; index++) {
            var element = canvas._objects[index];
            if (element.class !== "connector") {
                if (!element.done) {
                    return false
                }
            }
        }
        return true
    };
    this.verifyIntents = function() {
        for (var index = 0; index < canvas._objects.length; index++) {
            var element = canvas._objects[index];
            if (element.class !== "connector") {
                if (!element.done) {
                    return false
                }
            }
        }
        return true
    };

};