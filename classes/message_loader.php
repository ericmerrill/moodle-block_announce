<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * A block for showing announcements.
 *
 * @package    block_announce
 * @author     Eric Merrill <merrill@oakland.edu>
 * @copyright  2014 Oakland University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_announce;

class message_loader implements \cache_data_source {
    private $definition = null;

    /**
     * Returns an instance of the data source class that the cache can use for loading data using the other methods
     * specified by this interface.
     *
     * @param cache_definition $definition
     * @return object
     */
    public static function get_instance_for_cache(\cache_definition $definition) {
        return new message_loader($definition);
    }
    
    public function __construct(\cache_definition $def) {
        $this->definition = $def;
    }

    /**
     * Loads the data for the key provided ready formatted for caching.
     *
     * @param string|int $key The key to load.
     * @return mixed What ever data should be returned, or false if it can't be loaded.
     */
    public function load_for_cache($key) {
        global $DB;
        $blockid = $this->definition->get_identifiers()['blockid'];

        if ($key > 0) {
            return $DB->get_record('block_announce_messages', array('id' => $key), '*');
        } else {
            $fields = 'id, blockid, restrictions, starttime, endtime, timemodified';
            return $DB->get_records('block_announce_messages', array('blockid' => $blockid), 'starttime ASC', $fields);
        }
    }

    /**
     * Loads several keys for the cache.
     *
     * @param array $keys An array of keys each of which will be string|int.
     * @return array An array of matching data items.
     */
    public function load_many_for_cache(array $keys) {
        $out = array();
        
        foreach ($keys as $key) {
            $out[$key] = $this->load_for_cache($key);
        }
    }
}
