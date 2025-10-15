#!/usr/bin/env python3
"""
Script to pack plugin directories into .potext files
Usage: python pack-plugins.py [plugin_dir1] [plugin_dir2] ...
If no arguments provided, packs all plugin.com.pot-app.* directories
"""

import os
import sys
import zipfile
from pathlib import Path

def pack_plugin(plugin_dir: Path, project_root: Path) -> bool:
    """Pack a single plugin directory into .potext file"""
    plugin_name = plugin_dir.name
    output_file = project_root / f"{plugin_name}.potext"
    
    if not plugin_dir.is_dir():
        print(f"Error: Directory {plugin_dir} does not exist")
        return False
    
    # Check required files exist
    info_json = plugin_dir / "info.json"
    main_js = plugin_dir / "main.js"
    
    if not info_json.exists() or not main_js.exists():
        print(f"Error: {plugin_name} missing required files (info.json or main.js)")
        return False
    
    # Find SVG file
    svg_files = list(plugin_dir.glob("*.svg"))
    if not svg_files:
        print(f"Error: {plugin_name} missing SVG icon file")
        return False
    
    svg_file = svg_files[0]
    
    print(f"Packing {plugin_name}...")
    
    # Remove old potext file if exists
    if output_file.exists():
        output_file.unlink()
    
    # Create zip archive with only required files
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(info_json, info_json.name)
        zipf.write(main_js, main_js.name)
        zipf.write(svg_file, svg_file.name)
    
    print(f"✓ Created: {output_file}")
    return True

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    if len(sys.argv) > 1:
        # Pack specified directories
        plugin_dirs = [Path(arg) for arg in sys.argv[1:]]
    else:
        # No arguments: pack all plugin directories
        print("Packing all plugin directories...")
        plugin_dirs = sorted(project_root.glob("plugin.com.pot-app.*"))
        plugin_dirs = [d for d in plugin_dirs if d.is_dir()]
    
    if not plugin_dirs:
        print("No plugin directories found")
        return 1
    
    success_count = 0
    for plugin_dir in plugin_dirs:
        if pack_plugin(plugin_dir, project_root):
            success_count += 1
    
    print(f"\nDone! Successfully packed {success_count}/{len(plugin_dirs)} plugins")
    return 0 if success_count == len(plugin_dirs) else 1

if __name__ == "__main__":
    sys.exit(main())
