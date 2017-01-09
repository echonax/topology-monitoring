"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var topology_service_1 = require("./topology.service");
var topology_service_2 = require("./topology.service");
var d3 = require("d3");
var TopologyComponent = (function () {
    function TopologyComponent(dc, _element) {
        this.dc = dc;
        this._element = _element;
        this.isAddMenuHidden = true;
        this.host = d3.select(this._element.nativeElement);
        this.selectedNodes = [];
        this.whatToAdd = "switch";
        this.selectedCounter = 0;
        this.cursor = null;
        this.theSwState = true;
        this.isZoomed = false;
        this.firstJSON = topology_service_2.turkeyJSON;
    }
    TopologyComponent.prototype.radioClick = function (e) {
        this.whatToAdd = e.target.value;
        switch (this.whatToAdd) {
            case 'switch':
                this.linkFlag = false;
                this.addCursor();
                break;
            case 'host':
                this.linkFlag = false;
                this.addCursor();
                break;
            case 'link':
                this.linkFlag = true;
                d3.selectAll(".cursor").remove();
                break;
            default:
                d3.select('.cursor').attr('r', 20);
        }
        if (e.target.value == 'link') {
            d3.select('.info').style("opacity", 1);
        }
        else {
            d3.select('.info').style("opacity", 0);
        }
    };
    TopologyComponent.prototype.ngOnInit = function () {
        var that = this;
        this.addFlag = false;
        //this.svg.append("rect")
        //    .attr("class", "background")
        //    .attr("width", 1024)
        //    .attr("height", 500);
    };
    TopologyComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var that = this;
        this.jQuerySelectorsAndDefinitions();
        this.div = this.host.append("div")
            .attr("class", "topotooltip");
        this.zoom = d3.behavior.zoom()
            .translate([0, 0])
            .scale(1)
            .scaleExtent([.5, 20])
            .on("zoom", this.zoomed.bind(this));
        this.svg = d3.select("svg")
            .on("mousemove", function () {
            if (that.cursor) {
                that.cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
            }
        });
        this.svg.insert("image", ":first-child")
            .attr("xlink:href", "./app/topology/tr.svg")
            .attr("width", 1024)
            .attr("height", 500);
        this.svgChildren = this.svg
            .append('g')
            .attr('class', 'turkey-svg-g');
        this.svg.call(this.zoom)
            .on("mousedown.zoom", null)
            .on("mousewheel.zoom", null)
            .on("mousemove.zoom", null)
            .on("DOMMouseScroll.zoom", null)
            .on("dblclick.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null)
            .on("wheel.zoom", null)
            .on('mousedown.drag', null);
        //INIT
        this.currentJSON = this.dc.convert(topology_service_2.turkeyJSON);
        this.currentJSON.links.forEach(function (d) {
            d.source = _this.currentJSON.nodes[d.source];
            d.target = _this.currentJSON.nodes[d.target];
        });
        this.render(this.currentJSON);
    };
    TopologyComponent.prototype.shortestPathClick = function () {
        this.shortestPathFunc();
    };
    TopologyComponent.prototype.changePathClick = function () {
        this.changePathFunc();
    };
    TopologyComponent.prototype.addModeClick = function () {
        var _this = this;
        var that = this;
        d3.select('.add-menu').toggle(0, function () {
            if (!_this.addFlag) {
                _this.deSelectSelectedHosts();
                _this.cursor = _this.svgChildren.append("circle")
                    .attr("r", function () {
                    if (that.whatToAdd == 'switch') {
                        return 20;
                    }
                    else if (that.whatToAdd == 'host') {
                        return 4;
                    }
                })
                    .attr("transform", "translate(-100,-100)")
                    .attr("class", "cursor");
                _this.addFlag = true;
                d3.select('.turkey-svg').on('mousedown', function () {
                    if (that.addFlag && !that.linkFlag) {
                        var point = d3.mouse(this);
                        var node;
                        switch (that.whatToAdd) {
                            case 'switch':
                                node = {
                                    x: point[0],
                                    y: point[1],
                                    colorCode: 'B',
                                    type: 'Switch',
                                    name: 'switchName',
                                    status: 0
                                };
                                that.currentJSON.nodes.push(node);
                                break;
                            case 'host':
                                node = {
                                    x: point[0],
                                    y: point[1],
                                    colorCode: 'B',
                                    type: 'Host',
                                    status: 0
                                };
                                that.currentJSON.nodes.push(node);
                                break;
                            case 'link':
                                //let him choose 2 nodes to connect
                                break;
                            default:
                                console.log('default');
                        }
                        that.svgChildren.selectAll("*").remove();
                        that.render(that.currentJSON);
                        that.addCursor();
                    }
                });
            }
            else {
                _this.deSelectSelectedHosts();
                _this.selectedNodes = [];
                d3.select(".node").classed("selected", false);
                d3.select(".md-radiobtn[value='switch']").trigger("click");
                //destroy event
                _this.svg.on('mousedown', null);
                _this.addFlag = false;
                d3.selectAll(".cursor").remove();
            }
        });
        d3.select('.info').style("opacity", 0);
    };
    TopologyComponent.prototype.resetClick = function () {
        this.resetTopologyFunc();
    };
    TopologyComponent.prototype.jQuerySelectorsAndDefinitions = function () {
        this.roothoppingCheckbox = d3.select('.roothopping');
        this.roothoppingCheckboxState = this.roothoppingCheckbox.property("checked");
        this.allOutsideLinks = d3.select('.outside-link');
        this.switchText = d3.select('g.switchnode text');
        this.outsideHosts = d3.select('.hostnode');
        this.insideSwitch = d3.select('.insideswitch');
        this.insideSwitchLinks = d3.select('.inside-switch-link');
        this.insideSwitch.style("opacity", 0);
    };
    TopologyComponent.prototype.addCursor = function () {
        var _this = this;
        this.cursor = this.svgChildren.append("circle")
            .attr("r", function () {
            if (_this.whatToAdd == 'switch') {
                return 20;
            }
            else if (_this.whatToAdd == 'host') {
                return 4;
            }
        })
            .attr("transform", "translate(-100,-100)")
            .attr("class", "cursor");
    };
    TopologyComponent.prototype.deSelectSelectedHosts = function () {
        //because only hosts could be marked as selected in this scenario
        this.selectedCounter = 0;
        if (d3.select('.node').classed('selected')) {
            d3.selectAll('.selected').data().filter(function (d) {
                if (d.size == 10) {
                    d.size = 4.5;
                }
            });
            d3.selectAll('.selected').select('circle').transition().attr('r', 4.5);
            d3.select('.node').classed('selected', false);
        }
    };
    TopologyComponent.prototype.colorTheGraph = function (begNode, pathArray, graph) {
        //shift beginning node to front
        pathArray.push(begNode.switchName);
        var nodes = graph.nodes;
        var links = graph.links;
        //change the color code of the nodes
        for (var i = 0; i < pathArray.length; i++) {
            for (var key in nodes) {
                if (nodes[key].name == pathArray[i]) {
                    nodes[key].colorCode = "C";
                }
            }
        }
        //change the color code of the links
        for (var i = 0; i < pathArray.length - 1; i++) {
            for (var key in links) {
                if ((links[key].source.name == pathArray[i] && links[key].target.name == pathArray[i + 1]) || (links[key].target.name == pathArray[i] && links[key].source.name == pathArray[i + 1])) {
                    links[key].colorCode = "C";
                }
            }
        }
        return graph;
    };
    TopologyComponent.prototype.addLinkBetweenNodes = function (twoNodeArrayToJoin) {
        var node1 = twoNodeArrayToJoin[0];
        var node2 = twoNodeArrayToJoin[1];
        if (node1.type == 'Switch' && node2.type == 'Switch') {
            var link = {
                blocked: 0,
                colorCode: "B",
                customData: 1,
                destName: node2.name,
                destPortId: 1,
                linkId: 2,
                linkWeight: "B",
                order: 1,
                selfLink: false,
                source: node1,
                srcName: node1.name,
                srcPortId: 2,
                status: 0,
                target: node2,
                type: "Link"
            };
            this.currentJSON.links.push(link);
        }
        else if (node1.type == 'Host' && node2.type == 'Switch') {
            node1.switchName = node2.name;
            if (node2.children) {
                node2.children.push(node1);
            }
            else {
                node2.children = [{ node1: node1 }];
            }
            var link3 = {
                colorCode: "B",
                order: 1,
                source: node1,
                target: node2,
            };
            this.currentJSON.links.push(link3);
        }
        else if (node1.type == 'Switch' && node2.type == 'Host') {
            node2.switchName = node1.name;
            if (node1.children) {
                node1.children.push(node2);
            }
            else {
                node1.children = [{ node2: node2 }];
            }
            var link2 = {
                colorCode: "B",
                order: 1,
                source: node2,
                target: node1,
            };
            this.currentJSON.links.push(link2);
        }
        this.svgChildren.selectAll("*").remove();
        this.render(this.currentJSON);
    };
    TopologyComponent.prototype.changePathFunc = function () {
        if (this.selectedCounter == 2) {
            d3.selectAll('line')
                .filter(function (d, i) {
                if (d.colorCode == "C") {
                    d.colorCode = "B";
                    d.blocked = 1;
                }
            });
            this.svgChildren.selectAll("*").remove();
            this.shortestPathFunc();
        }
        else {
            alert('There must be a path first.');
        }
    };
    TopologyComponent.prototype.resetTopologyFunc = function () {
        var _this = this;
        this.isZoomed = false;
        this.selectedNodes = [];
        this.roothoppingCheckboxState = this.roothoppingCheckbox.property('checked', false);
        clearTimeout(this.dynamicR);
        this.selectedCounter = 0;
        this.svgChildren.selectAll("*").remove();
        //svg related, after the cleaning
        // this.svg.append("image")
        //     .attr("xlink:href", "./app/topology/tr.svg")
        //     .attr("width", 1024)
        //     .attr("height", 500);
        //then render
        var data = this.dc.convert(topology_service_2.turkeyJSON);
        data.links.forEach(function (d) {
            d.source = _this.currentJSON.nodes[d.source];
            d.target = _this.currentJSON.nodes[d.target];
        });
        this.render(data);
        this.jQuerySelectorsAndDefinitions();
    };
    TopologyComponent.prototype.shortestPathFunc = function () {
        var _this = this;
        if (this.selectedCounter == 2) {
            this.svgChildren.selectAll("*").remove();
            var pathsToBeColored = topology_service_1.TopologyService.initShortestPathCalculations(this.nodeBeg, this.nodeEnd, this.currentJSON);
            //you can delete this if but different path wont work on a destination node whose links have all been blocked
            if (pathsToBeColored == "Edge") {
                this.currentJSON.links.forEach(function (v, i) {
                    if (v.blocked != 0) {
                        v.blocked = 0;
                    }
                });
                pathsToBeColored = topology_service_1.TopologyService.initShortestPathCalculations(this.nodeBeg, this.nodeEnd, this.currentJSON);
            }
            var newGraph = this.colorTheGraph(this.nodeBeg, pathsToBeColored, this.currentJSON);
            this.render(newGraph);
        }
        else {
            alert("You must choose 2 nodes to calculate a path (little ones)");
        }
        if (this.roothoppingCheckboxState) {
            this.dynamicR = setTimeout(function () {
                _this.changePathFunc();
            }, 4000);
        }
    };
    TopologyComponent.prototype.ngOnDestroy = function () {
        this.svgChildren.selectAll("*").remove();
        d3.select('.topotooltip').remove();
    };
    TopologyComponent.prototype.render = function (graph) {
        var that = this;
        var link = this.svgChildren.append("g")
            .attr("class", "path-link")
            .selectAll("line")
            .style('stroke', "black")
            .style("stroke-width", function (d) {
            return topology_service_1.TopologyService.linkWidth(d);
        })
            .data(graph.links, function (d) {
            if (d.source && d.source.id) {
                return d.source.id + "-" + d.target.id;
            }
            else {
                return d.source + "-" + d.target;
            }
        });
        var linkEnter = link.enter().append("line")
            .attr("class", function (d) {
            if ((d.source && d.source.status == "1") || (d.target && d.target.status == "1")) {
                return "inside-switch-link";
            }
            else {
                return "outside-link";
            }
        })
            .on("contextmenu", function (d, i) {
            var dataset = [{
                    title: 'Remove Node',
                    data: d,
                    action: ""
                }];
            that.setContextMenu(that, dataset, d, i, this);
        })
            .style('stroke', function (d) {
            if (d.source.type === "Switch" && d.target.type === "Switch") {
                return topology_service_1.TopologyService.strokeColor(d);
            }
            else {
                if (d.colorCode == "A") {
                    return "red";
                }
                else if (d.colorCode == "B") {
                    return 'blue';
                }
                else if (d.colorCode == "C") {
                    return "green";
                }
                else if (d.colorCode == "D") {
                    return "aqua";
                }
                else if (d.colorCode == "E") {
                    return "purple";
                }
                else {
                    return "black";
                }
            }
        })
            .style("stroke-width", function (d) {
            return topology_service_1.TopologyService.linkWidth(d);
        })
            .attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });
        link.exit().remove();
        //var drag = d3.behavior.drag()
        //    .origin(function(d) { return d; })
        //    .on('drag', function (d,i) {
        //        d.x = d3.event.x;
        //        d.y = d3.event.y;
        //        d3.select(this).attr("transform", function (d, i) {
        //            return "translate(" + [d.x,d.y] + ")";
        //        });
        //        link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
        //        link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
        //    });
        var node = this.svgChildren.selectAll("g.node").data(graph.nodes);
        node.select("circle")
            .attr("r", function (d) {
            if (d.colorCode === "E") {
                return "10";
            }
            else if (d.type === "Internet") {
                return "images/internet_cloud.png";
            }
            else if (d.type === "Switch") {
                if (d.status == "0") {
                    return 20;
                }
                else if (d.status == 1) {
                    return 1.7;
                }
            }
            else {
                return 4.5;
            }
        })
            .style("stroke", topology_service_1.TopologyService.strokeColor)
            .style("stroke-width", topology_service_1.TopologyService.strokeWidth);
        node.select("text").attr("text-anchor", "middle")
            .attr("dy", function (d) {
            if (d.type == "Switch") {
                return "0.2em";
            }
            else {
                return "-0.6em";
            }
        })
            .text(function (d) {
            return d.name;
        });
        var nodeEnter = node.enter().append("g")
            .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")";
        })
            .attr("class", function (d) {
            if (d.type === "Host") {
                return "hostnode";
            }
            else if (d.type === "Switch") {
                if (d.status == "1") {
                    return "insideswitch";
                }
                else {
                    return "switchnode";
                }
            }
            return "node";
        })
            .on("contextmenu", function (d, i) {
            var dataset = [{
                    title: 'Remove Node',
                    data: d,
                    action: ""
                }];
            that.setContextMenu(that, dataset, d, i, this);
        })
            .attr("id", function (d, i) {
            return "node" + i;
        })
            .on("click", function (d) {
            if (that.whatToAdd != 'link') {
                if (d.type === "Host") {
                    if (!d3.select(this).classed("selected") && that.selectedCounter < 2 && d.size != 10) {
                        d3.select(this).classed("selected", true).select("circle").transition().duration(750).attr("r", "10");
                        that.selectedCounter++;
                        if (that.selectedCounter == 1) {
                            that.nodeBeg = d;
                            d.size = 10;
                        }
                        else if (that.selectedCounter == 2) {
                            that.nodeEnd = d;
                            d.size = 10;
                        }
                    }
                    else if (d3.select(this).classed("selected") || d.size == 10) {
                        d3.select(this).classed("selected", false).select("circle").transition().duration(750).attr("r", "4.5");
                        d.size = 4.5;
                        if (that.selectedCounter != 0) {
                            that.selectedCounter--;
                        }
                    }
                    else if (!d3.select(this).classed("selected") && that.selectedCounter == 2) {
                        alert("Please de-select one of the hosts in order to choose another one. Maximum selected host number must be 2");
                    }
                }
                else if (d.type === "Switch") {
                    var scale = 12;
                    if (!that.isZoomed) {
                        that.zoomedTopology();
                        d3.select(this).select("circle").transition().duration(750)
                            .style("fill-opacity", function (d) {
                            return 0.5;
                        })
                            .style("stroke-opacity", 0);
                        that.svg.transition().duration(1750).call(that.zoom.translate([1024 / 2 - scale * d.x, 500 / 2 - scale * d.y]).scale(scale).event);
                    }
                    else {
                        that.zoomedTopology();
                        d3.select(this).select("circle").transition().duration(750)
                            .style("fill-opacity", function (d) {
                            return 1;
                        })
                            .style("stroke-opacity", 1);
                        that.svg.transition().duration(1750).call(that.zoom.translate([0, 0]).scale(1).event);
                    }
                    that.isZoomed = !that.isZoomed;
                }
            }
            else if (that.whatToAdd == 'link') {
                var selected = d3.select(this).classed("selected");
                var r = d3.select(this).select('circle').attr('r');
                if (!selected && that.selectedNodes.length == 0) {
                    d3.select(this).classed("selected", true).select("circle").transition().duration(750).attr("r", r * 1.5);
                    that.selectedNodes.push(d);
                }
                else if (selected && that.selectedNodes.length == 1) {
                    d3.select(this).classed("selected", false).select("circle").transition().duration(750).attr("r", r * (2 / 3));
                    that.selectedNodes.pop();
                }
                else if ((!selected) && that.selectedNodes.length == 1) {
                    d3.select(this).classed("selected", true).select("circle").transition().duration(750).attr("stroke", 'red');
                    that.selectedNodes.push(d);
                    if (that.selectedNodes.length == 2) {
                        that.addLinkBetweenNodes(that.selectedNodes);
                        that.selectedNodes = [];
                        d3.select(".node").classed("selected", false);
                    }
                }
                else if (that.selectedNodes.length > 2) {
                    alert("Please de-select one of the hosts in order to choose another one. Maximum selected node number must be 2");
                }
            }
        });
        nodeEnter.append("circle")
            .attr("r", function (d) {
            if (d.type === "Switch") {
                if (d.status == "1") {
                    return 1.7;
                }
                else {
                    return 20;
                }
            }
            else {
                return d.size || 4.5;
            }
        })
            .style("stroke", topology_service_1.TopologyService.strokeColor)
            .style("stroke-width", function (d) {
            if (d.status == '1') {
                return 0.34;
            }
            else {
                return 2;
            }
        })
            .style("fill", topology_service_1.TopologyService.color);
        nodeEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", function (d) {
            if (d.type == "Switch") {
                if (d.status == '1') {
                    return "0.25em";
                }
                else {
                    return "0.25em";
                }
            }
            else {
                return "-0.6em";
            }
        })
            .text(function (d) {
            return d.type == "Switch" ? d.name : d.id;
        });
        nodeEnter.on("mouseover", that.mouseover.bind(that))
            .on("mousemove", that.mousemove.bind(that))
            .on("mouseout", that.mouseout.bind(that));
        node.exit().remove();
        this.jQuerySelectorsAndDefinitions();
    };
    TopologyComponent.prototype.zoomed = function () {
        var event = d3.event;
        this.svg.style("stroke-width", 1.5 / event.scale + "px");
        this.svg.attr("transform", "translate(" + event.translate + ")scale(" + event.scale + ")");
        console.log("zoom");
    };
    TopologyComponent.prototype.zoomedTopology = function () {
        if (!this.isZoomed) {
            this.allOutsideLinks.style("opacity", 0);
            this.switchText.style("opacity", 0);
            this.outsideHosts.style("opacity", 0);
            this.insideSwitch.style("opacity", 1);
            this.insideSwitchLinks.style("opacity", 1);
        }
        else {
            this.allOutsideLinks.style("opacity", 1);
            this.outsideHosts.style("opacity", 1);
            this.switchText.style("opacity", 1);
            this.insideSwitch.style("opacity", 0);
            this.insideSwitchLinks.style("opacity", 0);
        }
    };
    TopologyComponent.prototype.mouseover = function () {
        return this.div.style("opacity", 0.9);
    };
    TopologyComponent.prototype.mousemove = function (d) {
        if (d.type === "Switch") {
            var over_links = this.svgChildren.selectAll('.link').filter(function (link) {
                return link.source.name !== d.name && link.target.name !== d.name;
            });
            over_links.classed('blurred', true);
            return this.div.html("<span class=tool-info-head>Switch Name:</span> " + d.name);
        }
        else if (d.type === "Host") {
            return this.div.html("<span class=tool-info-head>Switch HW:</span>" + d.switchName);
        }
    };
    TopologyComponent.prototype.mouseout = function () {
        this.svg.selectAll('.link').classed('blurred', false);
        return this.div.html("");
    };
    TopologyComponent.prototype.setContextMenu = function (that, dataset, d, data3, data1) {
        var _this = this;
        // var mode, contextDiv;
        d3.selectAll('#contextmenu-node').data(dataset)
            .enter()
            .append('ul')
            .attr('id', 'contextmenu-node');
        //.style("list-style-type", "none");
        d3.event.preventDefault();
        if (d.type == "Switch" || d.type == "Link") {
            //  d3.selectAll("#contextmenu-node").html('');
            d3.select("#contextmenu-node")
                .selectAll('li').data(dataset).enter()
                .append('li');
            var event = d3.event;
            // display context menu
            d3.select('#contextmenu-node')
                .style('left', (event.pageX - 2) + 'px')
                .style('top', (event.pageY - 2) + 'px')
                .style('display', 'block')
                .html(function (i, d) {
                return "<li class='contextmenu-item' > Enable/Disable </li>";
            })
                .on("click", function (data, i) {
                if (data.data.type == "Switch") {
                    if (data.data.colorCode == "A") {
                        data.data.blocked = 0;
                        data.data.colorCode = "B";
                        var links = topology_service_1.TopologyService.activeLinkFinder(data.data, _this.currentJSON);
                        links.forEach(function (v, i) {
                            v.colorCode = "B";
                        });
                    }
                    else if (data.data.colorCode == "B" || data.data.colorCode == "C") {
                        data.data.blocked = 1;
                        data.data.colorCode = "A";
                        var links = topology_service_1.TopologyService.brokenLinkFinder(data.data, _this.currentJSON);
                        links.forEach(function (v, i) {
                            v.colorCode = "A";
                        });
                    }
                }
                else if (data.data.type == "Link") {
                    //if already disabled, enable it
                    if (data.data.colorCode == "A") {
                        data.data.blocked = 0;
                        data.data.colorCode = "B";
                        d3.select(".node").classed("selected", false);
                    }
                    else if (data.data.colorCode == "B" || data.data.colorCode == "C") {
                        data.data.blocked = 1;
                        data.data.colorCode = "A";
                    }
                }
                d3.select('#contextmenu-node').style('display', 'none');
                _this.svgChildren.selectAll("*").remove();
                _this.render(_this.currentJSON);
            })
                .on("mouseleave", function () {
                d3.select('#contextmenu-node').remove();
                // contextDiv = null;
                // mode = null;
            });
            d3.event.preventDefault();
        }
    };
    TopologyComponent.prototype.enableDisableClick = function () {
    };
    return TopologyComponent;
}());
TopologyComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'topology',
        templateUrl: './topology.component.html',
        styleUrls: ['./topology.component.css']
    }),
    __metadata("design:paramtypes", [topology_service_1.TopologyService, core_1.ElementRef])
], TopologyComponent);
exports.TopologyComponent = TopologyComponent;
//# sourceMappingURL=topology.component.js.map