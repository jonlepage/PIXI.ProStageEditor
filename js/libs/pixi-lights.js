/*!
 * pixi-lights - v2.0.1
 * Compiled Sat, 23 Jun 2018 00:20:51 UTC
 *
 * pixi-lights is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.PIXI = global.PIXI || {}, global.PIXI.lights = {})));
}(this, (function (exports) { 'use strict';

    /**
     * Contains mixins for the `PIXI.Circle` class.
     * @class Circle
     * @memberof PIXI
     * @see http://pixijs.download/release/docs/PIXI.Circle.html
     */
    /**
     * Creates vertices and indices arrays to describe this circle.
     * @method PIXI.Circle#getMesh
     * @param [totalSegments=40] {number} Total segments to build for the circle mesh.
     * @param [verticesOutput] {Float32Array} An array to output the vertices into. Length must be
     *  `((totalSegments + 2) * 2)` or more. If not passed it is created for you.
     * @param [indicesOutput] {Uint16Array} An array to output the indices into, in gl.TRIANGLE_FAN format. Length must
     *  be `(totalSegments + 3)` or more. If not passed it is created for you.
     * @return {PIXI.Circle~MeshData} Object with verticies and indices arrays
     */
    PIXI.Circle.prototype.getMesh = function getMesh(totalSegments, vertices, indices) {
        var this$1 = this;
        if ( totalSegments === void 0 ) totalSegments = 40;

        vertices = vertices || new Float32Array((totalSegments + 1) * 2);
        indices = indices || new Uint16Array(totalSegments + 1);

        var seg = (Math.PI * 2) / totalSegments,
            indicesIndex = -1;

        indices[++indicesIndex] = indicesIndex;

        for (var i = 0; i <= totalSegments; ++i) {
            var index = i*2;
            var angle = seg * i;

            vertices[index] = Math.cos(angle) * this$1.radius;
            vertices[index+1] = Math.sin(angle) * this$1.radius;

            indices[++indicesIndex] = indicesIndex;
        }

        indices[indicesIndex] = 1;

        return { vertices: vertices, indices: indices };
    };

    /**
     * @typedef PIXI.Circle~MeshData
     * @property {Float32Array} vertices - Vertices data
     * @property {Uint16Array} indices - Indices data
     */

    /**
     * @namespace PIXI.lights
     */

    /**
     * @static
     * @memberof PIXI.lights
     * @member {Object}
     */
    var plugins = {};

    /**
     * @static
     * @memberof PIXI.lights
     * @member {PIXI.display.Group}
     */
    var diffuseGroup = new PIXI.display.Group();

    /**
     * @static
     * @memberof PIXI.lights
     * @member {PIXI.display.Group}
     */
    var normalGroup = new PIXI.display.Group();

    /**
     * @static
     * @memberof PIXI.lights
     * @member {PIXI.display.Group}
     */
    var lightGroup = new PIXI.display.Group();

    diffuseGroup.useRenderTexture = true;
    normalGroup.useRenderTexture = true;

    /**
     * @static
     * @memberof PIXI.lights
     * @param {string} name - Name of the plugin
     * @param {class} classRef - Class references
     */
    function registerPlugin(name, classRef) {
        plugins[name] = classRef;
    }

    /**
     * @class
     * @extends PIXI.DisplayObject
     * @memberof PIXI.lights
     *
     * @param [color=0xFFFFFF] {number} The color of the light.
     * @param [brightness=1] {number} The brightness of the light, in range [0, 1].
     */
    var Light = (function (superclass) {
        function Light(color, brightness, vertices, indices) {
            superclass.call(this);

            /**
             * An array of vertices
             *
             * @member {Float32Array}
             */
            this.vertices = vertices || new Float32Array(8);

            /**
             * An array containing the indices of the vertices
             *
             * @member {Uint16Array}
             */
            this.indices = indices || new Uint16Array([0,1,2, 0,2,3]);

            /**
             * The blend mode to be applied to the light.
             *
             * @member {number}
             * @default PIXI.BLEND_MODES.ADD
             * @see http://pixijs.download/release/docs/PIXI.html#.BLEND_MODES
             */
            this.blendMode = PIXI.BLEND_MODES.ADD;

            /**
             * The draw mode to be applied to the light geometry.
             *
             * @member {number}
             * @default PIXI.DRAW_MODES.TRIANGLES
             * @see http://pixijs.download/release/docs/PIXI.html#.DRAW_MODES
             */
            this.drawMode = PIXI.DRAW_MODES.TRIANGLES;

            /**
             * When incremented the renderer will re-upload indices
             *
             * @member {number}
             */
            this.dirty = 0;

            /**
             * The height of the light from the viewport.
             *
             * @member {number}
             * @default 0.075
             */
            this.lightHeight = 0.075;

            /**
             * The falloff attenuation coeficients.
             *
             * @member {number[]}
             * @default [0.75, 3, 20]
             */
            this.falloff = [0.75, 3, 20];

            /**
             * The name of the shader plugin to use.
             *
             * @member {string}
             */
            this.shaderName = null;

            /**
             * By default the light uses a viewport sized quad as the mesh.
             */
            this.useViewportQuad = true;

            // color and brightness are exposed through setters
            this._color = 0x4d4d59;
            this._colorRgba = [0.3, 0.3, 0.35, 0.8];

            // run the color setter
            if (color || color === 0) {
                this.color = color;
            }

            // run the brightness setter
            if (brightness || brightness === 0) {
                this.brightness = brightness;
            }

            this.parentGroup = lightGroup;


            /**
             * WebGL data for this light
             * @member {Object}
             * @private
             */
            this._glDatas = {};

            this.shaderName = 'lights';
        }

        if ( superclass ) Light.__proto__ = superclass;
        Light.prototype = Object.create( superclass && superclass.prototype );
        Light.prototype.constructor = Light;

        var prototypeAccessors = { color: { configurable: true },brightness: { configurable: true } };

        /**
         * The color of the lighting.
         *
         * @member {number}
         * @memberof Light#
         */
        prototypeAccessors.color.get = function () {
            return this._color;
        };
        prototypeAccessors.color.set = function (val) {
            this._color = val;
            PIXI.utils.hex2rgb(val, this._colorRgba);
        };

        /**
         * The brightness of this lighting. Normalized in the range [0, 1].
         *
         * @member {number}
         * @memberof Light#
         */
        prototypeAccessors.brightness.get = function () {
            return this._colorRgba[3];
        };
        prototypeAccessors.brightness.set = function (val) {
            this._colorRgba[3] = val;
        };

        Light.prototype.syncShader = function syncShader (shader) {
            shader.uniforms.uUseViewportQuad = this.useViewportQuad;

            var uLightColor = shader.uniforms.uLightColor;
            if (uLightColor) {
                uLightColor[0] = this._colorRgba[0];
                uLightColor[1] = this._colorRgba[1];
                uLightColor[2] = this._colorRgba[2];
                uLightColor[3] = this._colorRgba[3];
                shader.uniforms.uLightColor = uLightColor;
            }

            shader.uniforms.uLightHeight = this.lightHeight;

            var uLightFalloff = shader.uniforms.uLightFalloff;
            if (uLightFalloff) {
                uLightFalloff[0] = this.falloff[0];
                uLightFalloff[1] = this.falloff[1];
                uLightFalloff[2] = this.falloff[2];
                shader.uniforms.uLightFalloff = uLightFalloff;
            }
        };

        Light.prototype._renderWebGL = function _renderWebGL (renderer) {
            renderer.setObjectRenderer(renderer.plugins.lights);
            renderer.plugins.lights.render(this);
        };

        Object.defineProperties( Light.prototype, prototypeAccessors );

        return Light;
    }(PIXI.Container));

    var vertex = "attribute vec2 aVertexPosition;\n\nuniform bool uUseViewportQuad;\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvoid main(void) {\n    if (uUseViewportQuad) {\n        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    }\n    else\n    {\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    }\n}\n";

    /**
     * @class
     * @extends PIXI.Shader
     * @memberof PIXI.lights
     * @param shaderManager {ShaderManager} The WebGL shader manager this shader works for.
     */
    var LightShader = (function (superclass) {
        function LightShader(gl, vertexSrc, fragmentSrc, customUniforms, customAttributes) {
            var uniforms = {
                translationMatrix:  { type: 'mat3', value: new Float32Array(9) },
                projectionMatrix:   { type: 'mat3', value: new Float32Array(9) },

                // textures from the previously rendered FBOs
                uSampler:       { type: 'sampler2D', value: null },
                uNormalSampler: { type: 'sampler2D', value: null },

                // should we apply the translation matrix or not.
                uUseViewportQuad: { type: 'bool', value: true },

                // size of the renderer viewport
                uViewSize:      { type: '2f', value: new Float32Array(2) },

                // light color, alpha channel used for intensity.
                uLightColor:    { type: '4f', value: new Float32Array([1, 1, 1, 1]) },

                // light falloff attenuation coefficients
                uLightFalloff:  { type: '3f', value: new Float32Array([0, 0, 0]) },

                // height of the light above the viewport
                uLightHeight: { type: '1f', value: 0.075 }
            };

            if (customUniforms) {
                for (var u in customUniforms) {
                    uniforms[u] = customUniforms[u];
                }
            }

            var attributes = {
                aVertexPosition: 0
            };

            if (customAttributes) {
                for (var a in customAttributes) {
                    attributes[a] = customAttributes[a];
                }
            }

            superclass.call(this, gl, vertexSrc || LightShader.defaultVertexSrc, fragmentSrc, attributes);
        }

        if ( superclass ) LightShader.__proto__ = superclass;
        LightShader.prototype = Object.create( superclass && superclass.prototype );
        LightShader.prototype.constructor = LightShader;

        return LightShader;
    }(PIXI.Shader));

    /**
     * @static
     * @member {string}
     */
    LightShader.defaultVertexSrc = vertex;

    /**
     * Ambient light is drawn using a full-screen quad
     * @class
     * @extends PIXI.lights.Light
     * @memberof PIXI.lights
     *
     * @param [color=0xFFFFFF] {number} The color of the light.
     * @param [brightness=0.5] {number} The brightness of the light.
     */
    var AmbientLight = (function (Light$$1) {
        function AmbientLight(color, brightness) {
            if ( color === void 0 ) color=0xFFFFFF;
            if ( brightness === void 0 ) brightness=0.5;

            Light$$1.call(this, color, brightness);
            this.shaderName = 'ambientLightShader';
        }

        if ( Light$$1 ) AmbientLight.__proto__ = Light$$1;
        AmbientLight.prototype = Object.create( Light$$1 && Light$$1.prototype );
        AmbientLight.prototype.constructor = AmbientLight;

        return AmbientLight;
    }(Light));

    var commonUniforms = "uniform sampler2D uSampler;\nuniform sampler2D uNormalSampler;\n\nuniform mat3 translationMatrix;\n\nuniform vec2 uViewSize;     // size of the viewport\n\nuniform vec4 uLightColor;   // light color, alpha channel used for intensity.\nuniform vec3 uLightFalloff; // light attenuation coefficients (constant, linear, quadratic)\nuniform float uLightHeight; // light height above the viewport\n";

    var computeVertexPosition = "vec2 texCoord = gl_FragCoord.xy / uViewSize;\ntexCoord.y = 1.0 - texCoord.y; // FBOs positions are flipped.\n";

    var loadNormals = "vec4 normalColor = texture2D(uNormalSampler, texCoord);\nnormalColor.g = 1.0 - normalColor.g; // Green layer is flipped Y coords.\n\n// bail out early when normal has no data\nif (normalColor.a == 0.0) discard;\n";

    var fragment = ("precision highp float;\n\n" + commonUniforms + "\n\nvoid main(void)\n{\n" + computeVertexPosition + "\n" + loadNormals + "\n\n    // simplified lambert shading that makes assumptions for ambient color\n\n    // compute Distance\n    float D = 1.0;\n\n    // normalize vectors\n    vec3 N = normalize(normalColor.xyz * 2.0 - 1.0);\n    vec3 L = vec3(1.0, 1.0, 1.0);\n\n    // pre-multiply light color with intensity\n    // then perform \"N dot L\" to determine our diffuse\n    vec3 diffuse = (uLightColor.rgb * uLightColor.a) * max(dot(N, L), 0.0);\n\n    vec4 diffuseColor = texture2D(uSampler, texCoord);\n    vec3 finalColor = diffuseColor.rgb * diffuse;\n\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n");

    /**
     * @class
     * @extends PIXI.lights.LightShader
     * @memberof PIXI.lights
     * @param gl {ShaderManager} The WebGL shader manager this shader works for.
     */
    var AmbientLightShader = (function (LightShader$$1) {
        function AmbientLightShader(gl) {
            LightShader$$1.call(this, gl, null, fragment);
        }

        if ( LightShader$$1 ) AmbientLightShader.__proto__ = LightShader$$1;
        AmbientLightShader.prototype = Object.create( LightShader$$1 && LightShader$$1.prototype );
        AmbientLightShader.prototype.constructor = AmbientLightShader;

        return AmbientLightShader;
    }(LightShader));

    registerPlugin('ambientLightShader', AmbientLightShader);

    /**
     * @class
     * @extends PIXI.lights.Light
     * @memberof PIXI.lights
     *
     * @param [color=0xFFFFFF] {number} The color of the light.
     * @param [brightness=1] {number} The intensity of the light.
     * @param [radius=Infinity] {number} The distance the light reaches. You will likely need
     *  to change the falloff of the light as well if you change this value. Infinity will
     *  use the entire viewport as the drawing surface.
     */
    var PointLight = (function (Light$$1) {
        function PointLight(color, brightness, radius) {
            if ( color === void 0 ) color=0xFFFFFF;
            if ( brightness === void 0 ) brightness=1;
            if ( radius === void 0 ) radius=Infinity;

            if (radius !== Infinity) {
                var shape = new PIXI.Circle(0, 0, radius);
                var ref = shape.getMesh();
                var vertices = ref.vertices;
                var indices = ref.indices;

                Light$$1.call(this, color, brightness, vertices, indices);

                this.useViewportQuad = false;
                this.drawMode = PIXI.DRAW_MODES.TRIANGLE_FAN;
            }
            else {
                Light$$1.call(this, color, brightness);
            }
            this.radius = radius;
            this.shaderName = 'pointLightShader';
        }

        if ( Light$$1 ) PointLight.__proto__ = Light$$1;
        PointLight.prototype = Object.create( Light$$1 && Light$$1.prototype );
        PointLight.prototype.constructor = PointLight;

        PointLight.prototype.syncShader = function syncShader (shader) {
            Light$$1.prototype.syncShader.call(this, shader);
            shader.uniforms.uLightRadius = this.radius;
        };

        return PointLight;
    }(Light));

    var computeDiffuse = "// normalize vectors\nvec3 N = normalize(normalColor.xyz * 2.0 - 1.0);\nvec3 L = normalize(lightVector);\n\n// pre-multiply light color with intensity\n// then perform \"N dot L\" to determine our diffuse\nvec3 diffuse = (uLightColor.rgb * uLightColor.a) * max(dot(N, L), 0.0);\n";

    var combine = "// calculate final intesity and color, then combine\nvec3 intensity = diffuse * attenuation;\nvec4 diffuseColor = texture2D(uSampler, texCoord);\nvec3 finalColor = diffuseColor.rgb * intensity;\n\ngl_FragColor = vec4(finalColor, diffuseColor.a);\n";

    var fragment$1 = ("precision highp float;\n\n// imports the common uniforms like samplers, and ambient color\n" + commonUniforms + "\n\nuniform float uLightRadius;\n\nvoid main()\n{\n" + computeVertexPosition + "\n" + loadNormals + "\n\n    vec2 lightPosition = translationMatrix[2].xy / uViewSize;\n\n    // the directional vector of the light\n    vec3 lightVector = vec3(lightPosition - texCoord, uLightHeight);\n\n    // correct for aspect ratio\n    lightVector.x *= uViewSize.x / uViewSize.y;\n\n    // compute Distance\n    float D = length(lightVector);\n\n    // bail out early when pixel outside of light sphere\n    if (D > uLightRadius) discard;\n\n" + computeDiffuse + "\n\n    // calculate attenuation\n    float attenuation = 1.0 / (uLightFalloff.x + (uLightFalloff.y * D) + (uLightFalloff.z * D * D));\n\n" + combine + "\n}\n");

    /**
     * @class
     * @extends PIXI.lights.LightShader
     * @memberof PIXI.lights
     * @param gl {ShaderManager} The WebGL shader manager this shader works for.
     */
    var PointLightShader = (function (LightShader$$1) {
        function PointLightShader(gl) {
            LightShader$$1.call(this, gl, null, fragment$1, {
                // height of the light above the viewport
                uLightRadius: {
                    type: '1f',
                    value: 1
                }
            });
        }

        if ( LightShader$$1 ) PointLightShader.__proto__ = LightShader$$1;
        PointLightShader.prototype = Object.create( LightShader$$1 && LightShader$$1.prototype );
        PointLightShader.prototype.constructor = PointLightShader;

        return PointLightShader;
    }(LightShader));

    registerPlugin('pointLightShader', PointLightShader);

    /**
     * @class
     * @extends PIXI.lights.Light
     * @memberof PIXI.lights
     *
     * @param [color=0xFFFFFF] {number} The color of the light.
     * @param [brightness=1] {number} The intensity of the light.
     * @param [target] {PIXI.DisplayObject|PIXI.Point} The object in the scene to target.
     */
    var DirectionalLight = (function (Light$$1) {
        function DirectionalLight(color, brightness, target) {
            if ( color === void 0 ) color=0xFFFFFF;
            if ( brightness === void 0 ) brightness=1;

            Light$$1.call(this, color, brightness);

            this.target = target;
            this._directionVector = new PIXI.Point();
            this.shaderName = 'directionalLightShader';
        }

        if ( Light$$1 ) DirectionalLight.__proto__ = Light$$1;
        DirectionalLight.prototype = Object.create( Light$$1 && Light$$1.prototype );
        DirectionalLight.prototype.constructor = DirectionalLight;

        DirectionalLight.prototype.updateTransform = function updateTransform () {
            this.containerUpdateTransform();

            var vec = this._directionVector,
                wt = this.worldTransform,
                tx = this.target.worldTransform ? this.target.worldTransform.tx : this.target.x,
                ty = this.target.worldTransform ? this.target.worldTransform.ty : this.target.y;

            // calculate direction from this light to the target
            vec.x = wt.tx - tx;
            vec.y = wt.ty - ty;

            // normalize
            var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
            vec.x /= len;
            vec.y /= len;
        };

        DirectionalLight.prototype.syncShader = function syncShader (shader) {
            Light$$1.prototype.syncShader.call(this, shader);

            var uLightDirection = shader.uniforms.uLightDirection;
            uLightDirection[0] = this._directionVector.x;
            uLightDirection[1] = this._directionVector.y;
            shader.uniforms.uLightDirection = uLightDirection;
        };

        return DirectionalLight;
    }(Light));

    var fragment$2 = ("precision highp float;\n\n// imports the common uniforms like samplers, and ambient/light color\n" + commonUniforms + "\n\nuniform vec2 uLightDirection;\n\nvoid main()\n{\n" + computeVertexPosition + "\n" + loadNormals + "\n\n    // the directional vector of the light\n    vec3 lightVector = vec3(uLightDirection, uLightHeight);\n\n    // compute Distance\n    float D = length(lightVector);\n\n" + computeDiffuse + "\n\n    // calculate attenuation\n    float attenuation = 1.0;\n\n" + combine + "\n}\n");

    /**
     * @class
     * @extends PIXI.Shader
     * @memberof PIXI.lights
     * @param shaderManager {ShaderManager} The WebGL shader manager this shader works for.
     */
    var DirectionalLightShader = (function (LightShader$$1) {
        function DirectionalLightShader(gl) {
            LightShader$$1.call(this, gl, null, fragment$2, {
                // the directional vector of the light
                uLightDirection: {
                    type: '2f',
                    value: new Float32Array(2)
                }
            });
        }

        if ( LightShader$$1 ) DirectionalLightShader.__proto__ = LightShader$$1;
        DirectionalLightShader.prototype = Object.create( LightShader$$1 && LightShader$$1.prototype );
        DirectionalLightShader.prototype.constructor = DirectionalLightShader;

        return DirectionalLightShader;
    }(LightShader));

    registerPlugin('directionalLightShader', DirectionalLightShader);

    /**
     * @class
     * @private
     * @memberof PIXI.lights
     * @extends PIXI.ObjectRenderer
     * @param renderer {PIXI.WebGLRenderer} The renderer this sprite batch works for.
     */
    var LightRenderer = (function (superclass) {
        function LightRenderer(renderer) {
            var this$1 = this;

            superclass.call(this, renderer);

            // the total number of indices in our batch, there are 6 points per quad.
            var numIndices = LightRenderer.MAX_LIGHTS * 6;

            /**
             * Holds the indices
             *
             * @member {Uint16Array}
             */
            this.indices = new Uint16Array(numIndices);

            //TODO this could be a single buffer shared amongst all renderers as we reuse this set up in most renderers
            for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                this$1.indices[i + 0] = j + 0;
                this$1.indices[i + 1] = j + 1;
                this$1.indices[i + 2] = j + 2;
                this$1.indices[i + 3] = j + 0;
                this$1.indices[i + 4] = j + 2;
                this$1.indices[i + 5] = j + 3;
            }

            this.shaders = {};

            /**
             * The current lights in the batch.
             *
             * @member {Light[]}
             */
            this.lights = [];
        }

        if ( superclass ) LightRenderer.__proto__ = superclass;
        LightRenderer.prototype = Object.create( superclass && superclass.prototype );
        LightRenderer.prototype.constructor = LightRenderer;

        LightRenderer.prototype.onContextChange = function onContextChange () {
            var this$1 = this;

            this.gl = this.renderer.gl;
            for (var key in plugins) {
                this$1.shaders[key] = new (plugins[key])(this$1.gl);
            }
        };

        /**
         * Renders the light object.
         * @private
         * @param light {Light} the light to render
         */
        LightRenderer.prototype.render = function render (mesh) {
            var renderer = this.renderer;
            var gl = renderer.gl;

            this.lights.push(mesh);
            /**
             * Prepares all the buffers to render this light.
             */
            var glData = mesh._glDatas[renderer.CONTEXT_UID];

            if (!glData) {
                renderer.bindVao(null);

                glData = {
                    shader: this.shaders[mesh.shaderName],
                    vertexBuffer: PIXI.glCore.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
                    indexBuffer: PIXI.glCore.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
                    // build the vao object that will render..
                    vao: null,
                    dirty: mesh.dirty
                };

                // build the vao object that will render..
                glData.vao = new PIXI.glCore.VertexArrayObject(gl)
                    .addIndex(glData.indexBuffer)
                    .addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0);

                mesh._glDatas[renderer.CONTEXT_UID] = glData;
            }

            renderer.bindVao(glData.vao);

            if (mesh.useViewportQuad) {
                mesh.vertices[2] = mesh.vertices[4] = renderer.screen.width;
                mesh.vertices[5] = mesh.vertices[7] = renderer.screen.height;
            }
            glData.vertexBuffer.upload(mesh.vertices);

            if (glData.dirty !== mesh.dirty) {
                glData.dirty = mesh.dirty;
                glData.indexBuffer.upload(mesh.indices);
            }
        };

        LightRenderer.prototype.flush = function flush () {
            var this$1 = this;

            var diffuseTexture = null,
                normalTexture = null,
                lastLayer = null,
                lastShader = null,
                renderer = this.renderer;

            for (var i = 0; i < this.lights.length; ++i) {
                var light = this$1.lights[i],
                    layer = this$1.lights[i]._activeParentLayer;

                if (!layer) {
                    continue;
                }

                if (lastLayer !== layer) {
                    lastLayer = layer;
                    var stage = layer._activeStageParent;

                    if (layer.diffuseTexture &&
                        layer.normalTexture) {
                        diffuseTexture = layer.diffuseTexture;
                        normalTexture = layer.normalTexture;
                    }
                    else {
                        for (var j = 0; j < stage._activeLayers.length; j++) {
                            var texLayer = stage._activeLayers[j];
                            if (texLayer.group === normalGroup) {
                                normalTexture = texLayer.getRenderTexture();
                            }
                            if (texLayer.group === diffuseGroup) {
                                diffuseTexture = texLayer.getRenderTexture();
                            }
                        }
                    }

                    renderer.bindTexture(diffuseTexture, 0, true);
                    renderer.bindTexture(normalTexture, 1, true);
                }

                var glData = light._glDatas[renderer.CONTEXT_UID],
                    shader = glData.shader;

                if (lastShader !== shader) {
                    lastShader = shader;
                    renderer.bindShader(shader);

                    shader.uniforms.uSampler = 0;
                    shader.uniforms.uNormalSampler = 1;

                    var uViewSize = shader.uniforms.uViewSize;
                    uViewSize[0] = renderer.screen.width;
                    uViewSize[1] = renderer.screen.height;
                    shader.uniforms.uViewSize = uViewSize;
                }

                renderer.bindVao(glData.vao);

                light.syncShader(shader);
                renderer.state.setBlendMode(light.blendMode);
                shader.uniforms.translationMatrix = light.worldTransform.toArray(true);

                glData.vao.draw(light.drawMode, light.indices.length, 0);
            }

            this.lights.length = 0;
        };

        LightRenderer.prototype.stop = function stop () {
            this.flush();
        };

        return LightRenderer;
    }(PIXI.ObjectRenderer));

    /**
     * Maximum number of lights
     * @static
     * @member {number}
     */
    LightRenderer.MAX_LIGHTS = 500;

    PIXI.WebGLRenderer.registerPlugin('lights', LightRenderer);

    var vertex$1 = "attribute vec2 aVertexPosition;\nuniform mat3 projectionMatrix;\n\nvoid main(void) {\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n}";

    var fragment$3 = "void main() {\n    gl_FragColor = vec4(0, 0, 0, 1);\n}";

    /**
     * @class
     * @extends PIXI.Shader
     * @memberof PIXI.lights
     * @param shaderManager {ShaderManager} The WebGL shader manager this shader works for.
     */
    var WireframeShader = (function (superclass) {
        function WireframeShader(gl) {
            superclass.call(this, gl, vertex$1, fragment$3, {
                aVertexPosition: 0
            });
        }

        if ( superclass ) WireframeShader.__proto__ = superclass;
        WireframeShader.prototype = Object.create( superclass && superclass.prototype );
        WireframeShader.prototype.constructor = WireframeShader;

        return WireframeShader;
    }(PIXI.Shader));

    registerPlugin('wireframeShader', WireframeShader);

    /**
     * @namespace PIXI
     */

    exports.Light = Light;
    exports.LightShader = LightShader;
    exports.AmbientLight = AmbientLight;
    exports.AmbientLightShader = AmbientLightShader;
    exports.PointLight = PointLight;
    exports.PointLightShader = PointLightShader;
    exports.DirectionalLight = DirectionalLight;
    exports.DirectionalLightShader = DirectionalLightShader;
    exports.LightRenderer = LightRenderer;
    exports.WireframeShader = WireframeShader;
    exports.plugins = plugins;
    exports.diffuseGroup = diffuseGroup;
    exports.normalGroup = normalGroup;
    exports.lightGroup = lightGroup;
    exports.registerPlugin = registerPlugin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi-lights.js.map
