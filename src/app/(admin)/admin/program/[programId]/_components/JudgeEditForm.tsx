"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useCallback, useState } from "react";
import {
  JudgeUpdateFormSchema,
  JudgeUpdateFormType,
} from "../_lib/JudgeFormSchema";
import JudgeCompanySelect from "./JudgeCompanySelect";
import JudgeUserSelect from "./JudgeUserSelect";
import JudgeCriteriaSelect from "./JudgeCriteriaSelect";
import { FileText, GripVertical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useJudgeEditMutations } from "../_hooks/useJudgeEditMutations";

type Props = {
  programId: number;
  judgingRoundId?: string;
  judgingRoundInfo: JudgeUpdateFormType;
};

export interface SimpleCompany {
  id: number;
  name: string;
  pdf_file?: File;
  pdf_path?: string;
  group_name?: string;
  judge_num?: number;
}
export interface SimpleUser {
  id: string;
  name: string;
  affiliation: string | null;
  group_name?: string;
}

export interface SimpleCriteria {
  id?: number;
  item_name: string;
  points: number;
  description?: string | null;
}

function SortableCompanyItem({
  item,
  index,
  pdfEditMap,
  onClickPdfEdit,
  onFileChange,
  onGroupChange,
}: {
  item: SimpleCompany;
  index: number;
  pdfEditMap: Record<number, boolean>;
  onClickPdfEdit: (companyId: number) => void;
  onFileChange: (index: number, file?: File) => void;
  onGroupChange: (index: number, value: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const pdfPathExists = !!item.pdf_path;
  const isEditMode = pdfEditMap[item.id] === true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-2 border-b border-neutral-100 px-3 py-3 sm:flex-row sm:items-center ${
        isDragging ? "z-10 bg-neutral-50 shadow-md" : ""
      }`}
    >
      <button
        type="button"
        className="flex shrink-0 cursor-grab items-center text-neutral-400 hover:text-neutral-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="mr-1 shrink-0 text-xs font-medium text-neutral-400">
        {index + 1}
      </span>
      <div className="flex w-full flex-1 sm:w-32">
        <p className="text-sm font-medium text-neutral-900">{item.name}</p>
      </div>
      <div className="flex items-center gap-2">
        {pdfPathExists && !isEditMode ? (
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="gap-1.5"
            onClick={() => onClickPdfEdit(item.id)}
          >
            <FileText className="h-3.5 w-3.5" />
            PDF 변경
          </Button>
        ) : (
          <Input
            type="file"
            accept="application/pdf"
            className="h-9 text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onFileChange(index, file);
            }}
          />
        )}
      </div>
      <div className="sm:w-32">
        <Input
          type="text"
          placeholder="그룹 (ex. A)"
          className="h-9 text-sm"
          value={item.group_name ?? ""}
          onChange={(e) => onGroupChange(index, e.target.value)}
        />
      </div>
    </div>
  );
}

export default function JudgeEditForm({
  programId,
  judgingRoundId,
  judgingRoundInfo,
}: Props) {
  const [targetList, setTargetList] = useState<SimpleCompany[]>([]);
  const [targetUserList, setTargetUserList] = useState<SimpleUser[]>([]);
  const [targetCriteriaList, setTargetCriteriaList] = useState<SimpleCriteria[]>([]);
  const [pdfEditMap, setPdfEditMap] = useState<Record<number, boolean>>({});

  const { basicMutation, usersMutation, companiesMutation, criteriaMutation } =
    useJudgeEditMutations(judgingRoundId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTargetList((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const form = useForm<JudgeUpdateFormType>({
    resolver: zodResolver(JudgeUpdateFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: judgingRoundInfo.name ?? "",
      description: judgingRoundInfo.description ?? "",
      start_date: judgingRoundInfo.start_date ?? "",
      end_date: judgingRoundInfo.end_date ?? "",
    },
  });

  const handleUserListChange = useCallback((newList: SimpleUser[]) => {
    setTargetUserList(newList);
  }, []);

  const handleClickPdfEdit = (companyId: number) => {
    setPdfEditMap((prev) => ({ ...prev, [companyId]: true }));
  };

  const handleFileChange = (index: number, file?: File) => {
    setTargetList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], pdf_file: file };
      return newArr;
    });
  };

  const handleGroupChange = (index: number, value: string) => {
    setTargetList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], group_name: value };
      return newArr;
    });
  };

  const handleUserGroupChange = (index: number, value: string) => {
    setTargetUserList((prev) => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], group_name: value };
      return newArr;
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="basic">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="basic" className="flex-1">
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex-1">
            참여 기업
          </TabsTrigger>
          <TabsTrigger value="judges" className="flex-1">
            심사자
          </TabsTrigger>
          <TabsTrigger value="criteria" className="flex-1">
            심사 기준
          </TabsTrigger>
        </TabsList>

        {/* (1) 기본 정보 */}
        <TabsContent value="basic">
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                기본 정보
              </h3>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  basicMutation.mutate(data)
                )}
                className="space-y-4 p-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">
                        심사 이름
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="심사 이름을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">설명</FormLabel>
                      <FormControl>
                        <Input placeholder="설명을 입력해주세요." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700">
                          시작일
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-700">
                          종료일
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <LoadingButton
                    type="submit"
                    size="sm"
                    loading={basicMutation.isPending}
                  >
                    기본 정보 수정
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </section>
        </TabsContent>

        {/* (2) 심사 참여 기업 */}
        <TabsContent value="companies">
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                심사 참여 기업
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                프로그램에 등록된 기업 중 이 심사에 참여할 기업을 선택합니다.
              </p>
            </div>
            <div className="space-y-4 p-4">
              <JudgeCompanySelect
                judgingRoundId={judgingRoundId ?? ""}
                programId={programId}
                targetList={targetList}
                onTargetListChange={setTargetList}
              />

              {targetList.length > 0 && (
                <div className="rounded-lg border border-neutral-200">
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <span className="text-xs font-medium text-neutral-600">
                      기업별 상세 설정 (드래그하여 순서 변경)
                    </span>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={targetList.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="max-h-96 overflow-y-auto">
                        {targetList.map((item, index) => (
                          <SortableCompanyItem
                            key={item.id}
                            item={item}
                            index={index}
                            pdfEditMap={pdfEditMap}
                            onClickPdfEdit={handleClickPdfEdit}
                            onFileChange={handleFileChange}
                            onGroupChange={handleGroupChange}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="flex justify-end">
                <LoadingButton
                  type="button"
                  size="sm"
                  loading={companiesMutation.isPending}
                  onClick={() =>
                    companiesMutation.mutate(targetList, {
                      onSuccess: (updatedList) => setTargetList(updatedList),
                    })
                  }
                >
                  기업 정보 수정
                </LoadingButton>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* (3) 심사자 */}
        <TabsContent value="judges">
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-neutral-900">심사자</h3>
            </div>
            <div className="space-y-4 p-4">
              <JudgeUserSelect
                judgingRoundId={judgingRoundId ?? ""}
                targetList={targetUserList}
                onTargetListChange={handleUserListChange}
              />

              {targetUserList.length > 0 && (
                <div className="rounded-lg border border-neutral-200">
                  <div className="border-b border-neutral-100 px-3 py-2">
                    <span className="text-xs font-medium text-neutral-600">
                      심사자별 그룹 설정
                    </span>
                  </div>
                  <div className="max-h-96 divide-y divide-neutral-100 overflow-y-auto">
                    {targetUserList.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 px-3 py-2.5"
                      >
                        <div className="w-24 shrink-0">
                          <p className="text-sm font-medium text-neutral-900">
                            {user.name}
                          </p>
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder="그룹 (ex. A)"
                            className="h-9 text-sm"
                            value={user.group_name ?? ""}
                            onChange={(e) =>
                              handleUserGroupChange(index, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <LoadingButton
                  type="button"
                  size="sm"
                  loading={usersMutation.isPending}
                  onClick={() => usersMutation.mutate(targetUserList)}
                >
                  심사자 정보 수정
                </LoadingButton>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* (4) 심사 기준 배점 */}
        <TabsContent value="criteria">
          <section className="rounded-lg border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-neutral-900">
                심사 기준 배점
              </h3>
            </div>
            <div className="space-y-4 p-4">
              <JudgeCriteriaSelect
                judgingRoundId={judgingRoundId}
                targetList={targetCriteriaList}
                onTargetListChange={setTargetCriteriaList}
              />
              <div className="flex justify-end">
                <LoadingButton
                  type="button"
                  size="sm"
                  loading={criteriaMutation.isPending}
                  onClick={() => criteriaMutation.mutate(targetCriteriaList)}
                >
                  심사 기준 수정
                </LoadingButton>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
