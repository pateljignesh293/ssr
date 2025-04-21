import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaBars } from 'react-icons/fa';
import './table.css';
import Dialog from '../Dialog';
import Button from '../Basic/Button';
import Checkbox from '../Basic/Checkbox';
import DropdownMenu from '../DropdownMenu';

/* eslint-disable react/no-array-index-key */

const DragHandle = () => (
  <span className="hover:bg-blue-100 cursor-move w-8 h-8 inline-flex justify-center items-center rounded-full">
    <FaBars />
  </span>
);

const SortableItem = ({ item, index, handleChecked, keys }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-gray-50 rounded p-4 border">
      <div className="grid grid-cols-3 gap-4" key={index}>
        <DragHandle />
        <div>{item.key}</div>
        <Checkbox
          checked={keys[index].show}
          name={item.key}
          label=" "
          handleChange={() => handleChecked(index)}
        />
      </div>
    </div>
  );
};

const SortableList = ({ items, handleChecked, keys, onSortEnd }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);
      onSortEnd({ oldIndex, newIndex });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div>
          {items.map((item, index) => (
            <SortableItem key={item._id} item={item} index={index} handleChecked={handleChecked} keys={keys} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

function CustomTable({ keyList }) {
  const [keys, setKeys] = useState(keyList);
  const [open, setOpen] = useState(false);

  const handleShow = () => setOpen(true);
  const handleHide = () => setOpen(false);

  const handleChecked = (index) => {
    const tempKeys = [...keys];
    tempKeys[index] = { ...tempKeys[index], show: !tempKeys[index].show };
    setKeys(tempKeys);
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setKeys((prevKeys) => arrayMove(prevKeys, oldIndex, newIndex));
  };

  return (
    <div className="bg-white mt-4">
      <Dialog
        className="w-3/5"
        open={open}
        onClose={handleHide}
        title={'Choose Keys'}
        body={
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>Order</div>
              <div>Key</div>
              <div>Show</div>
            </div>
            <SortableList items={keys} handleChecked={handleChecked} keys={keys} onSortEnd={handleSortEnd} />
          </>
        }
      />
      <div className="my-2 flex justify-start">
        <Button onClick={handleShow}> Manage Columns </Button>
      </div>
    </div>
  );
}

export default CustomTable;