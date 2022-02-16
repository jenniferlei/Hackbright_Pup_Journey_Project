// {% for bookmarks_list in bookmarks_lists_by_user_hike|sort(attribute='bookmarks_list_name') %}
//             <div class="card mt-1">
//               <div class="card-header">
//                 <div class="clearfix">
//                   <div style="float:left">
//                     <a
//                       class="btn btn-md"
//                       data-bs-toggle="collapse"
//                       href="#collapse-bookmarks-{{ bookmarks_list.bookmarks_list_id }}"
//                       role="button"
//                       aria-expanded="false"
//                       aria-controls="collapse-bookmarks-{{ bookmarks_list.bookmarks_list_id }}"
//                     >
//                       {{ bookmarks_list.bookmarks_list_name }} <i data-bs-toggle="tooltip" data-bs-placement="right" title="view all hikes in list" class="bi bi-caret-down"></i>
//                     </a>
//                   </div>

//                   <div class="d-flex" style="float:right">

//                     <a
//                     href=""
//                     data-bs-toggle="modal"
//                     data-bs-target="#modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}"
//                     style="color: rgb(44, 44, 44)"
//                     >
//                       <small><i data-bs-toggle="tooltip" data-bs-placement="right" title="rename list" class="bi bi-pencil"></i></small>
//                     </a>

//                     &nbsp;&nbsp;&nbsp;

//                     <form
//                       action="/delete-bookmarks-list"
//                       method="POST"
//                     >
//                       <button
//                         class="btn btn-sm"
//                         style="padding:0"
//                         type="submit"
//                         name="delete"
//                         value="{{ bookmarks_list.bookmarks_list_id }}"
//                         onclick="return confirm('Do you want to delete this list?');"
//                       >
//                         <i data-bs-toggle="tooltip" data-bs-placement="right" title="delete list" class="bi bi-x"></i>
//                       </button>
//                     </form>
//                   </div>

//                 </div>
//               </div>
//               <!-- End Delete Bookmark Form -->

//               <div
//                 class="collapse card-body"
//                 id="collapse-bookmarks-{{ bookmarks_list.bookmarks_list_id }}">
//                 <div>
//                   {% for hike in bookmarks_list.hikes|sort(attribute='hike_name') %}
//                   <div class="row">
//                     <div class="d-flex">
//                       <form
//                         action="/remove-hike"
//                         method="POST">
//                         <button
//                           class="btn btn-sm"
//                           style="padding:0"
//                           type="submit"
//                           name="delete"
//                           value="{{ hike.hike_id }},{{ bookmarks_list.bookmarks_list_id }}"
//                           onclick="return confirm('Do you want to remove this hike?');"
//                         ><small>
//                           <i data-bs-toggle="tooltip" data-bs-placement="right" title="remove from list" class="bi bi-x"></i>
//                         </small></button>
//                       </form>

//                       &nbsp;&nbsp;&nbsp;

//                       <a href="/hikes/{{ hike.hike_id }}" target="_blank">
//                         {{ hike.hike_name }}
//                       </a>
//                     </div>
//                   </div>
//                   {% endfor %}
//                 </div>
//               </div>
//             </div>
//             {% endfor %}
//           </div>

// <!-- Start Rename Bookmark Modal -->
//               <div class="modal fade" id="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}" tabindex="-1" aria-labelledby="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}-label" aria-hidden="true">
//                 <div class="modal-dialog">
//                   <div class="modal-content">
//                     <div class="modal-header">
//                       <h5 class="modal-title" id="modal-rename-bookmark-{{ bookmarks_list.bookmarks_list_id }}-label">Rename Bookmark</h5>
//                       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                     </div>
//                     <div class="modal-body">
//                       <form
//                         action="/edit-bookmarks-list"
//                         method="POST"
//                       >
//                         <div class="mb-3">
//                         <input
//                           type="text"
//                           name="bookmarks_list_name"
//                           class="form-control input-lg"
//                           value="{{ bookmarks_list.bookmarks_list_name }}"
//                           required
//                         />
//                       </div>

//                       <div class="modal-footer">
//                         <button class="btn btn-sm btn-outline-dark btn-block" type="submit" name="edit" value="{{ bookmarks_list.bookmarks_list_id }}">Save</button>
//                         <button type="button" class="btn btn-sm btn-secondary btn-block" data-bs-dismiss="modal">Close</button>
//                       </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <!-- End Rename Bookmark Modal -->
