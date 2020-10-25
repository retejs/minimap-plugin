Rete Minimap plugin
====
#### Rete.js plugin

Introduction
----
Minimap is a reduced copy of the full editor screen with the ability to quickly navigate using small pointer window. The pointer window is always above any other control or nodes and is therefore always available.

Installation
----
The plugin can be installed with default params ('right-bottom' position with 220x220px windows size).

```js
import MinimapPlugin from 'rete-minimap-plugin';

editor.use(MinimapPlugin);
```

Using the params, you can define the minimap size and visibility.

Available options:

'size' - set minimap size, can be 'small' (150x150), 'middle' (220x220) or 'big' (300x300).
'enable' - minimap on/off.

Later, by changing the values in the object passed to the plugin, you can change the minimap size or visibility.


```js
import MinimapPlugin from 'rete-minimap-plugin';

const params = { size: 'small', enable: false };
editor.use(MinimapPlugin, params );
...
...
params.enable = true; //show minimap window
}
```

Styling
----
If you want to override the default minimap styles, add a new selector to your css file and specify new styles with the !importtant modifier.
For example, to move the map to the upper-left corner and change the background color, add the following content:

```css
.node-editor .minimap {
	top: 24px !important;
	left: 24px !important;
    background: rgba(132, 89, 52, 0.1) !important;
}
```

