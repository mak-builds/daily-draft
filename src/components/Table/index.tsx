/* eslint-disable no-unused-vars */
"use client";

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Text,
  Select,
  Input,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  ReactElement,
} from "react";
import moment from "moment";
import { HEADER_HEIGHT_WITH_PADDING } from "@/utils/constants";
import { ParseEnum } from "@/utils/helpers/enumParser";
import ImageModalComponent from "../Modal";
import { LiaFilterSolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { Header } from "@/types/table";
import { CiMenuKebab } from "react-icons/ci";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { useRouter, useSearchParams } from "next/navigation";
import Shimmer from "./Shimmer";

interface Filter {
  column: any;
  value: string;
  columnType?: string;
  columnItem?: any[];
}

interface Properties {
  headers: Header;
  fetchTableCount: (payload: any) => Promise<number>;
  fetchTableData: (payload: any) => Promise<any[]>;

  hasTabs?: boolean;
  hasKpis?: boolean;
  isClickable?: boolean;
  refetchStatus?: boolean;
  searchPlaceholder?: string;
  addlRightButton?: ReactElement;
  refetchData?: () => void;
  handleClick?: (data: any) => void;
  fetchAllData?: () => Promise<any[]>;
  handleSoftDelete?: (payload: any) => void;
  handleHardDelete?: (payload: any) => void;
  handleActionChange?: (
    actionType: string,
    data: any,
    userId?: string | any
  ) => void;
  handleMenuChange?: (
    actionType: string,
    data: any,
    userId?: string | any
  ) => void;
}

const TableComponent = ({
  headers,
  fetchTableData,
  fetchTableCount,
  isClickable = false,
  hasTabs = false,
  hasKpis = false,
  handleActionChange,
  handleMenuChange,
  handleClick,
  handleSoftDelete,
  handleHardDelete,
  fetchAllData,
  addlRightButton,
  refetchStatus,
  refetchData,
  searchPlaceholder = "Search...",
}: Properties) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    nbPerPage: 10,
    searchQuery: "",
    sortField: "",
    sortOrder: "asc",
  });
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    deleteType: "",
  });
  const [showImageModal, setShowImageModal] = useState({
    status: false,
    imagesHeader: {},
    imagesData: {},
  });

  const addFilter = () => {
    setFilters([...filters, { column: "", value: "" }]);
  };

  const handleFilterChange = (
    index: number,
    key: keyof Filter,
    value: string
  ) => {
    if (key === "column" && headers.filters) {
      const selectedOption = headers.filters.find(
        (header) => header.id === value
      );
      if (selectedOption?.columnType === "Enum") {
        setFilters(
          filters.map((filter, i) =>
            i === index
              ? {
                  ...filter,
                  [key]: value,
                  columnType: selectedOption?.columnType,
                  columnItem: selectedOption?.columnItem,
                  value: selectedOption?.columnItem?.[0]?.id ?? "",
                }
              : filter
          )
        );
      } else {
        const newFilters = filters.map((filter, i) =>
          i === index
            ? {
                ...filter,
                [key]: value,
                columnType: selectedOption?.columnType,
                columnItem: selectedOption?.columnItem,
              }
            : filter
        );
        setFilters(newFilters);
      }
    } else {
      const newFilters = filters.map((filter, i) =>
        i === index
          ? {
              ...filter,
              [key]: value,
            }
          : filter
      );
      setFilters(newFilters);
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const fetchCount = async () => {
    const payload = {
      searchQuery: pagination.searchQuery,
      filters,
    };

    if (fetchTableCount) {
      const data = await fetchTableCount(payload);
      setCount(data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const startIndex = (pagination.currentPage - 1) * pagination.nbPerPage;
    const endIndex = startIndex + pagination.nbPerPage - 1;
    const payload = {
      searchQuery: pagination.searchQuery,
      startIndex,
      endIndex,
      sortField: pagination.sortField,
      sortOrder: pagination.sortOrder,
      filters,
    };
    const data = await fetchTableData(payload);
    setTableData(data || []);
    setLoading(false);
  };

  // useEffect(() => {
  //   const page = searchParams.get("page");
  //   const nbperpage = searchParams.get("nbperpage");
  //   // const params = new URLSearchParams(searchParams);

  //   if (page) {
  //     setPagination((prev) => ({
  //       ...prev,
  //       currentPage: Number(page),
  //     }));
  //   } else {
  //     // params.set("page", "1");
  //     // setPagination((prev) => ({
  //     //   ...prev,
  //     //   currentPage: 1,
  //     // }));
  //   }

  //   if (nbperpage) {
  //     setPagination((prev) => ({
  //       ...prev,
  //       nbPerPage: Number(nbperpage),
  //     }));
  //   } else {
  //     // params.set("nbperpage", "10");
  //     // setPagination((prev) => ({
  //     //   ...prev,
  //     //   nbPerPage: 10,
  //     // }));
  //   }
  //   // router.push(`?${params.toString()}`);
  // }, []);

  useEffect(() => {
    if (refetchStatus && refetchData) {
      fetchData();
      fetchCount();
      refetchData();
    }
  }, [refetchStatus]);

  useEffect(() => {
    fetchData();
    fetchCount();
  }, [
    pagination.currentPage,
    pagination.nbPerPage,
    pagination.searchQuery,
    pagination.sortField,
    pagination.sortOrder,
  ]);

  const handleAction = async (actionId: string, data: any) => {
    if (handleActionChange) {
      const response: any = await handleActionChange(actionId, data);
      if (response?.shouldRefetch) {
        fetchData();
      }
    }
  };

  const handleMenu = async (actionId: string, data: any) => {
    if (handleMenuChange) {
      const response: any = await handleMenuChange(actionId, data);
      if (response?.shouldRefetch) {
        fetchData();
      }
    }
  };

  const debounce = useCallback(
    (func: (value: string) => void, delay: number) => {
      // eslint-disable-next-line no-undef
      let timer: NodeJS.Timeout;
      return (value: string) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(value), delay);
      };
    },
    []
  );

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        router.push(`?${params.toString()}`);

        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          searchQuery: value,
        }));
      }, 400),
    [debounce]
  );

  const numberOfPages = useMemo(() => {
    return Math.ceil(count / pagination.nbPerPage);
  }, [count, pagination.nbPerPage]);

  const getPageNumbers = useCallback(() => {
    const start = Math.max(pagination.currentPage - 1, 1);
    const end = Math.min(pagination.currentPage + 2, numberOfPages);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [pagination.currentPage, numberOfPages]);

  const handleNbPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.set("nbperpage", Number(event.target.value).toString());
      router.push(`?${params.toString()}`);

      setPagination((prev) => ({
        ...prev,
        currentPage: 1,
        nbPerPage: Number(event.target.value),
      }));
    },
    []
  );

  const handleRowClick = (record: any) => {
    if (isClickable && handleClick) handleClick(record);
  };

  const handleSort = (field: string) => {
    setPagination((prev) => ({
      ...prev,
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const applyFilters = () => {
    const newFilters = filters.filter(
      (filter) => filter.column !== "" && filter.value !== ""
    );
    setFilters(newFilters);
    fetchData();
    fetchCount();
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (fetchAllData) {
        const getAllUsersData = await fetchAllData();
        setIsSelectAll(true);
        setSelectedIds(getAllUsersData.map((item) => item.id));
      }
    } else {
      setIsSelectAll(false);
      setSelectedIds([]);
    }
  };

  const hardDelete = async () => {
    setConfirmationModal({ status: true, deleteType: "hard_delete" });
  };

  const softDelete = async () => {
    setConfirmationModal({ status: true, deleteType: "soft_delete" });
  };

  const handleConfirm = async () => {
    setConfirmationModal({ status: false, deleteType: "" });
    if (confirmationModal.deleteType === "soft_delete") {
      setSelectedIds([]);
      if (handleSoftDelete) {
        const response: any = await handleSoftDelete(selectedIds);
        if (response?.shouldRefetch) {
          fetchData();
          fetchCount();
        }
      }
    } else {
      setSelectedIds([]);
      if (handleHardDelete) {
        const response: any = await handleHardDelete(selectedIds);
        if (response?.shouldRefetch) {
          fetchData();
          fetchCount();
        }
      }
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, deleteType: "" });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <Box px={4} py={4} bg="white" borderRadius="md" overflow={"hidden"}>
      <Flex alignItems="center" mb={4} justifyContent={"space-between"}>
        <Input
          variant={"table"}
          placeholder={searchPlaceholder}
          onChange={(e) => handleSearchChange(e.target.value)}
          width="200px"
          mr={4}
        />
        <Flex gap={4} alignItems={"center"}>
          {headers.hasDelete && selectedIds.length > 0 && (
            <>
              <Button
                variant={"default"}
                onClick={softDelete}
                isDisabled={selectedIds.length === 0}
              >
                Soft Delete
              </Button>
              <Button
                variant={"default"}
                onClick={hardDelete}
                isDisabled={selectedIds.length === 0}
              >
                Hard Delete
              </Button>
            </>
          )}
          {headers.hasFilters === true && (
            <Popover variant={"brand"} isLazy>
              <PopoverTrigger>
                <Button leftIcon={<LiaFilterSolid />}>
                  {filters.length > 0
                    ? `${filters.length} filters applied`
                    : "Filters"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <Text as={"h4"} fontWeight={"bold"}>
                    Filters
                  </Text>
                </PopoverHeader>
                <Divider borderColor={"gray.500"} />
                <PopoverBody>
                  <Flex
                    flexDir={"column"}
                    gap={2}
                    px={4}
                    py={4}
                    height={"300px"}
                    maxH={"300px"}
                    overflow={"auto"}
                    className="scroll"
                  >
                    {filters.length > 0 ? (
                      <>
                        {filters.map((filter, index) => (
                          <Flex key={index} gap={2}>
                            <Select
                              variant={"table"}
                              borderRadius={"0"}
                              value={filter.column}
                              onChange={(e) =>
                                handleFilterChange(
                                  index,
                                  "column",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select column</option>
                              {headers.filters?.map((header, index) => (
                                <option key={index} value={header.id}>
                                  {header.columnName}
                                </option>
                              ))}
                            </Select>
                            {filter.columnType === "Enum" ? (
                              <Select
                                variant={"table"}
                                borderRadius={"0"}
                                value={filter.value}
                                onChange={(e) =>
                                  handleFilterChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              >
                                {filter?.columnItem?.map((header, index) => {
                                  return (
                                    <option key={index} value={header.id}>
                                      {header.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            ) : (
                              <Input
                                variant={"auth"}
                                type="text"
                                placeholder="search"
                                borderRadius={0}
                                value={filter.value}
                                onChange={(e) =>
                                  handleFilterChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                            <IoCloseOutline
                              onClick={() => removeFilter(index)}
                              size={40}
                            />
                          </Flex>
                        ))}
                      </>
                    ) : (
                      <Text as={"h4"}>No Selected Filters</Text>
                    )}
                  </Flex>
                  <Divider borderColor={"gray.500"} />
                  <Flex justifyContent={"space-between"} px={2} py={3}>
                    <Button
                      variant={"default"}
                      as={"h6"}
                      cursor={"pointer"}
                      leftIcon={<IoIosAdd />}
                      onClick={addFilter}
                    >
                      Add filters
                    </Button>
                    <Button
                      variant={"default"}
                      cursor={"pointer"}
                      as={"h6"}
                      onClick={applyFilters}
                    >
                      Apply
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
          {addlRightButton && addlRightButton}
        </Flex>
      </Flex>
      <Flex
        width={"inherit"}
        maxW={"inherit"}
        minH={`calc(100vh - ${HEADER_HEIGHT_WITH_PADDING} - 150px - ${
          hasTabs ? "40px" : "0px"
        } - ${hasKpis ? "146px" : "0px"})`}
        maxH={`calc(100vh - ${HEADER_HEIGHT_WITH_PADDING} - 150px - ${
          hasTabs ? "40px" : "0px"
        } - ${hasKpis ? "146px" : "0px"})`}
        overflow={"auto"}
        className="scroll"
      >
        {!loading && tableData.length === 0 ? (
          <Flex width={"100%"} justifyContent={"center"} alignItems={"center"}>
            <Text as={"h5"}>No Data Found</Text>
          </Flex>
        ) : (
          <Table variant="users">
            <Thead>
              <Tr>
                {headers.properties.map((heading, index) => (
                  <React.Fragment key={index}>
                    {heading.type === "Delete" ? (
                      <Th>
                        <Checkbox
                          isChecked={
                            isSelectAll ||
                            selectedIds.length === tableData.length
                          }
                          onChange={handleSelectAll}
                        />
                        {selectedIds.length > 0 && (
                          <Text ml={1}>{selectedIds.length}</Text>
                        )}
                      </Th>
                    ) : (
                      <Th
                        cursor="pointer"
                        onClick={() => {
                          heading.shouldSort && handleSort(heading.id);
                        }}
                      >
                        {heading.columnName}
                        {heading.shouldSort &&
                        pagination.sortField === heading.id
                          ? pagination.sortOrder === "asc"
                            ? " ▲"
                            : " ▼"
                          : null}
                      </Th>
                    )}
                  </React.Fragment>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <>
                  {Array.from({ length: pagination.nbPerPage }, (_, index) => (
                    <Shimmer key={index} headers={headers.properties} />
                  ))}
                </>
              ) : (
                <>
                  {tableData.map((record, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Tr
                          key={record.id}
                          cursor={isClickable ? "pointer" : "default"}
                        >
                          {headers.properties.map((header, index_) => {
                            return (
                              <React.Fragment key={index_}>
                                {header.type === "Delete" ? (
                                  <Td key={index_}>
                                    <Checkbox
                                      isChecked={selectedIds.includes(
                                        record.id
                                      )}
                                      onChange={() =>
                                        handleSelectRow(record.id)
                                      }
                                    />
                                  </Td>
                                ) : header.type === "Index" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {(pagination.currentPage - 1) *
                                      pagination.nbPerPage +
                                      index +
                                      1}
                                  </Td>
                                ) : header.type === "String" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    <Tooltip
                                      label={
                                        record[header.id]
                                          ? ParseEnum(record[header.id])
                                          : "NA"
                                      }
                                    >
                                      {record[header.id]
                                        ? ParseEnum(record[header.id])
                                        : "NA"}
                                    </Tooltip>
                                  </Td>
                                ) : header.type === "Email" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    <Tooltip label={record[header.id]}>
                                      {record[header.id] || "NA"}
                                    </Tooltip>
                                  </Td>
                                ) : header.type === "Boolean" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id] === false
                                      ? "False"
                                      : "True"}
                                  </Td>
                                ) : header.type === "Date" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id]
                                      ? moment(record[header.id]).format(
                                          "DD MMM YYYY"
                                        )
                                      : "NA"}
                                  </Td>
                                ) : header.type === "Number" ? (
                                  <Td
                                    key={index_}
                                    onClick={() => handleRowClick(record)}
                                  >
                                    {record[header.id] || 0}
                                  </Td>
                                ) : header.type === "Action" ? (
                                  <Td key={index_}>
                                    <Menu variant={"table"}>
                                      {({ isOpen }) => (
                                        <>
                                          <MenuButton>
                                            <CiMenuKebab />
                                          </MenuButton>
                                          {isOpen && (
                                            <MenuList>
                                              {header.actionData?.map(
                                                (action, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    onClick={() => {
                                                      if (handleActionChange) {
                                                        handleAction(
                                                          action.id,
                                                          record
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    {action.name}
                                                  </MenuItem>
                                                )
                                              )}
                                            </MenuList>
                                          )}
                                        </>
                                      )}
                                    </Menu>
                                  </Td>
                                ) : header.type === "Menu" ? (
                                  <Td key={index_}>
                                    <Select
                                      width={"150px"}
                                      variant={"brand"}
                                      defaultValue={
                                        // @ts-ignore
                                        record[header.actionValue]
                                          ? ParseEnum(
                                              // @ts-ignore
                                              record[header.actionValue]
                                            )
                                          : "null"
                                      }
                                      onChange={(event) => {
                                        if (handleMenuChange) {
                                          handleMenu(
                                            record.id,
                                            event.target.value
                                          );
                                        }
                                      }}
                                    >
                                      <option value="">Select column</option>
                                      {header.menuData?.map((action, index) => (
                                        <option value={action.id} key={index}>
                                          {action.name}
                                        </option>
                                      ))}
                                    </Select>
                                  </Td>
                                ) : header.type === "Status" ? (
                                  <Td key={index_}>
                                    <Box borderRadius={"sm"}>
                                      {record[header.id]
                                        ? record[header.id]
                                        : "NA"}
                                    </Box>
                                  </Td>
                                ) : (
                                  <></>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </Tr>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </Tbody>
          </Table>
        )}
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"} mt={4}>
        <Select
          isDisabled={tableData.length <= 0}
          width="fit-content"
          value={pagination.nbPerPage}
          onChange={handleNbPerPageChange}
          mr={2}
        >
          {[10, 15, 20].map((perPage, index) => (
            <option key={index} value={perPage}>
              {perPage} per page
            </option>
          ))}
        </Select>
        <Flex justifyContent="center">
          <Text as={"h5"}>
            Page {pagination.currentPage} of {numberOfPages} of {count} entries
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Button
            isDisabled={pagination.currentPage === 1 || tableData.length === 0}
            onClick={() =>
              handlePageChange(Math.max(pagination.currentPage - 1, 1))
            }
            disabled={pagination.currentPage === 1}
          >
            Prev
          </Button>
          <Flex>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                isActive={pagination.currentPage === page}
                mx={1}
              >
                {page}
              </Button>
            ))}
          </Flex>
          <Button
            isDisabled={
              pagination.currentPage === numberOfPages || tableData.length === 0
            }
            onClick={() =>
              handlePageChange(
                Math.min(pagination.currentPage + 1, numberOfPages)
              )
            }
            disabled={pagination.currentPage === numberOfPages}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      {showImageModal.status === true && (
        <ImageModalComponent
          imagesData={showImageModal.imagesData}
          imagesHeader={showImageModal.imagesHeader}
          handleClose={() => {
            setShowImageModal({
              status: false,
              imagesData: {},
              imagesHeader: {},
            });
          }}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Box>
  );
};

export default TableComponent;
